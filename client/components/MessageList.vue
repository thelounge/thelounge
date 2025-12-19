<template>
	<div ref="chat" class="chat" tabindex="-1">
		<div v-show="showLoadMoreButton" class="show-more">
			<button
				ref="loadMoreButton"
				:disabled="channel.historyLoading || !store.state.isConnected"
				class="btn"
				@click="onShowMoreClick"
			>
				<span v-if="channel.historyLoading">Loading…</span>
				<span v-else>Show older messages</span>
			</button>
		</div>
		<div
			class="messages"
			role="log"
			aria-live="polite"
			aria-relevant="additions"
			@copy="onCopy"
		>
			<template v-for="(message, idx) in displayedMessages" :key="getMessageKey(message)">
				<DateMarker
					v-if="shouldDisplayDateMarker(message, idx)"
					:message="message as any"
					:focused="isMessageFocused(message)"
				/>
				<div
					v-if="shouldDisplayUnreadMarker(Number(message.id))"
					class="unread-marker"
				>
					<span class="unread-marker-text" />
				</div>

				<MessageCondensed
					v-if="message.type === 'condensed'"
					:network="network"
					:keep-scroll-position="keepScrollPosition"
					:messages="message.messages"
					:focused="isMessageFocused(message)"
				/>
				<Message
					v-else
					:channel="channel"
					:network="network"
					:message="message"
					:keep-scroll-position="keepScrollPosition"
					:is-previous-source="isPreviousSource(message, idx)"
					:focused="isMessageFocused(message)"
					@toggle-link-preview="onLinkPreviewToggle"
				/>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import {condensedTypes} from "../../shared/irc";
import {ChanType} from "../../shared/types/chan";
import {MessageType, SharedMsg} from "../../shared/types/msg";
import eventbus from "../js/eventbus";
import clipboard from "../js/clipboard";
import socket from "../js/socket";
import Message from "./Message.vue";
import MessageCondensed from "./MessageCondensed.vue";
import DateMarker from "./DateMarker.vue";
import {
	computed,
	defineComponent,
	nextTick,
	onBeforeUnmount,
	onBeforeUpdate,
	onMounted,
	onUnmounted,
	PropType,
	ref,
	watch,
} from "vue";
import {useStore} from "../js/store";
import {ClientChan, ClientMessage, ClientNetwork, ClientLinkPreview} from "../js/types";

type CondensedMessageContainer = {
	type: "condensed";
	time: Date;
	messages: ClientMessage[];
	id?: number;
};

// TODO: move into component
let unreadMarkerShown = false;

// Render at most this many messages - keeps DOM manageable
const MAX_RENDERED_MESSAGES = 500;

export default defineComponent({
	name: "MessageList",
	components: {
		Message,
		MessageCondensed,
		DateMarker,
	},
	props: {
		network: {type: Object as PropType<ClientNetwork>, required: true},
		channel: {type: Object as PropType<ClientChan>, required: true},
		focused: Number,
		focusedTime: Number,
	},
	setup(props) {
		const store = useStore();

		const chat = ref<HTMLDivElement | null>(null);
		const loadMoreButton = ref<HTMLButtonElement | null>(null);
		const historyObserver = ref<IntersectionObserver | null>(null);

		// The currently focused/highlighted message ID (primary) or time (fallback)
		const focusedMsgId = ref<number | null>(null);
		const focusedMsgTime = ref<number | null>(null);

		// Flag to prevent scroll handler during programmatic scrolls
		const isScrolling = ref(false);

		// Window start index for virtual scrolling - tracks which message index to start from
		const windowStartIndex = ref(0);

		// Track if we're currently adjusting the window (to prevent scroll handler interference)
		const isAdjustingWindow = ref(false);

		// Threshold for triggering window shifts (in pixels from edge)
		const SCROLL_THRESHOLD = 200;

		// Build condensed message list (all messages, before windowing)
		const allCondensedMessages = computed(() => {
			if (props.channel.type !== ChanType.CHANNEL && props.channel.type !== ChanType.QUERY) {
				return props.channel.messages;
			}

			if (store.state.settings.statusMessages === "hidden") {
				return props.channel.messages.filter(
					(message) => !condensedTypes.has(message.type || "")
				);
			}

			if (store.state.settings.statusMessages !== "condensed") {
				return props.channel.messages;
			}

			let lastCondensedContainer: CondensedMessageContainer | null = null;
			const condensed: (ClientMessage | CondensedMessageContainer)[] = [];

			for (const message of props.channel.messages) {
				if (message.self || message.highlight || !condensedTypes.has(message.type || "")) {
					lastCondensedContainer = null;
					condensed.push(message);
					continue;
				}

				if (!lastCondensedContainer) {
					lastCondensedContainer = {
						time: message.time,
						type: "condensed",
						messages: [],
					};
					condensed.push(lastCondensedContainer);
				}

				lastCondensedContainer.messages.push(message);
				lastCondensedContainer.id = message.id;

				if (message.id === props.channel.firstUnread) {
					lastCondensedContainer = null;
				}
			}

			return condensed.map((message) => {
				if (message.type === "condensed" && message.messages.length === 1) {
					return message.messages[0];
				}
				return message;
			});
		});

		// Windowed messages for rendering - show MAX_RENDERED_MESSAGES from windowStartIndex
		// This does NOT depend on scrolledToBottom to avoid reactivity issues
		const displayedMessages = computed(() => {
			const all = allCondensedMessages.value;
			const total = all.length;

			if (total <= MAX_RENDERED_MESSAGES) {
				return all;
			}

			// Use the window start index, clamped to valid range
			const start = Math.max(0, Math.min(windowStartIndex.value, total - MAX_RENDERED_MESSAGES));
			return all.slice(start, start + MAX_RENDERED_MESSAGES);
		});

		// Check if we can scroll further back in the window (not at start of all messages)
		const canScrollBack = computed(() => {
			return windowStartIndex.value > 0;
		});

		// Check if we're showing the latest messages
		const isAtEnd = computed(() => {
			const total = allCondensedMessages.value.length;
			return total <= MAX_RENDERED_MESSAGES ||
				windowStartIndex.value >= total - MAX_RENDERED_MESSAGES;
		});

		// Should we show the "load more" button?
		// Only show when at the start of all loaded messages AND server has more
		const showLoadMoreButton = computed(() => {
			return props.channel.moreHistoryAvailable && windowStartIndex.value === 0;
		});

		// Helper to get a unique key for each message
		const getMessageKey = (message: ClientMessage | CondensedMessageContainer) => {
			if (message.type === "condensed") {
				return `condensed-${message.messages[0]?.id}-${new Date(message.time).getTime()}`;
			}
			// Use time as part of key since IDs can be inconsistent
			return `${message.id}-${new Date(message.time).getTime()}`;
		};

		// Check if a message is focused (by ID first, then timestamp fallback)
		const isMessageFocused = (message: ClientMessage | CondensedMessageContainer): boolean => {
			// Check by ID first (preferred)
			if (focusedMsgId.value !== null) {
				if (message.type === "condensed") {
					return message.messages.some(inner => inner.id === focusedMsgId.value);
				}
				return message.id === focusedMsgId.value;
			}

			// Fallback to time-based matching
			if (!focusedMsgTime.value) return false;

			const msgTime = new Date(message.time).getTime();
			// Allow 1 second tolerance
			if (Math.abs(msgTime - focusedMsgTime.value) < 1000) {
				return true;
			}

			// Check inside condensed messages
			if (message.type === "condensed") {
				for (const inner of message.messages) {
					const innerTime = new Date(inner.time).getTime();
					if (Math.abs(innerTime - focusedMsgTime.value) < 1000) {
						return true;
					}
				}
			}

			return false;
		};

		// Scroll to bottom of the current DOM
		const scrollToBottom = () => {
			if (chat.value) {
				isScrolling.value = true;
				chat.value.scrollTop = chat.value.scrollHeight;
				// Reset after a short delay to allow the scroll event to fire
				setTimeout(() => {
					isScrolling.value = false;
				}, 50);
			}
		};

		// Jump to the absolute bottom (latest messages) and mark as at bottom
		const jumpToBottom = async () => {
			const total = allCondensedMessages.value.length;
			windowStartIndex.value = Math.max(0, total - MAX_RENDERED_MESSAGES);
			props.channel.scrolledToBottom = true;
			isAdjustingWindow.value = true;
			await nextTick();
			scrollToBottom();
			isAdjustingWindow.value = false;
		};

		// Shift window up (show older messages) while preserving scroll position
		const shiftWindowUp = async (amount: number = 100) => {
			if (isAdjustingWindow.value || windowStartIndex.value <= 0) return;

			const el = chat.value;
			if (!el) return;

			isAdjustingWindow.value = true;
			const oldScrollHeight = el.scrollHeight;
			const oldScrollTop = el.scrollTop;

			// Shift window up
			const newStart = Math.max(0, windowStartIndex.value - amount);
			const actualShift = windowStartIndex.value - newStart;
			if (actualShift === 0) {
				isAdjustingWindow.value = false;
				return;
			}

			windowStartIndex.value = newStart;
			props.channel.scrolledToBottom = false;

			await nextTick();

			// Restore scroll position relative to the content that was visible
			const newScrollHeight = el.scrollHeight;
			const heightDiff = newScrollHeight - oldScrollHeight;
			el.scrollTop = oldScrollTop + heightDiff;

			isAdjustingWindow.value = false;
		};

		// Shift window down (show newer messages) while preserving scroll position
		const shiftWindowDown = async (amount: number = 100) => {
			if (isAdjustingWindow.value) return;

			const total = allCondensedMessages.value.length;
			const maxStart = Math.max(0, total - MAX_RENDERED_MESSAGES);
			if (windowStartIndex.value >= maxStart) return;

			const el = chat.value;
			if (!el) return;

			isAdjustingWindow.value = true;
			const oldScrollHeight = el.scrollHeight;
			const oldScrollTop = el.scrollTop;

			// Shift window down
			const newStart = Math.min(maxStart, windowStartIndex.value + amount);
			windowStartIndex.value = newStart;

			// Check if we're now at the end
			if (newStart >= maxStart) {
				props.channel.scrolledToBottom = true;
			}

			await nextTick();

			// Restore scroll position relative to the content that was visible
			const newScrollHeight = el.scrollHeight;
			const heightDiff = oldScrollHeight - newScrollHeight;
			el.scrollTop = oldScrollTop - heightDiff;

			isAdjustingWindow.value = false;
		};

		// Find and scroll to a message by ID
		const jumpToMessage = async (msgId: number, fallbackTime?: number): Promise<boolean> => {
			focusedMsgId.value = msgId;
			focusedMsgTime.value = fallbackTime || null;
			props.channel.scrolledToBottom = false;
			isAdjustingWindow.value = true;

			// Find the message index in all messages
			const all = allCondensedMessages.value;
			let targetIndex = -1;

			for (let i = 0; i < all.length; i++) {
				const msg = all[i];
				if (msg.type === "condensed") {
					if (msg.messages.some(inner => inner.id === msgId)) {
						targetIndex = i;
						break;
					}
				} else if (msg.id === msgId) {
					targetIndex = i;
					break;
				}
			}

			// If not found by ID and we have a fallback time, try time-based search
			if (targetIndex === -1 && fallbackTime) {
				for (let i = 0; i < all.length; i++) {
					const msg = all[i];
					const msgTime = new Date(msg.time).getTime();
					if (Math.abs(msgTime - fallbackTime) < 1000) {
						targetIndex = i;
						break;
					}
					if (msg.type === "condensed") {
						for (const inner of msg.messages) {
							const innerTime = new Date(inner.time).getTime();
							if (Math.abs(innerTime - fallbackTime) < 1000) {
								targetIndex = i;
								break;
							}
						}
					}
					if (targetIndex !== -1) break;
				}
			}

			if (targetIndex === -1) {
				// Message not found in current messages
				isAdjustingWindow.value = false;
				return false;
			}

			// Adjust window to include the target message (center it if possible)
			if (all.length > MAX_RENDERED_MESSAGES) {
				const halfWindow = Math.floor(MAX_RENDERED_MESSAGES / 2);
				windowStartIndex.value = Math.max(0, Math.min(
					targetIndex - halfWindow,
					all.length - MAX_RENDERED_MESSAGES
				));
			}

			await nextTick();

			// Find and scroll to the element
			if (chat.value) {
				const el = chat.value.querySelector(`#msg-${msgId}`) as HTMLElement;
				if (el) {
					isScrolling.value = true;
					el.scrollIntoView({ behavior: "instant", block: "center" });

					setTimeout(() => {
						isScrolling.value = false;
						isAdjustingWindow.value = false;
					}, 50);

					// Clear highlight after a few seconds
					setTimeout(() => {
						focusedMsgId.value = null;
						focusedMsgTime.value = null;
					}, 3000);

					return true;
				}
			}

			isAdjustingWindow.value = false;
			return false;
		};

		// Find and scroll to a message by timestamp (legacy fallback)
		const jumpToMessageByTime = async (timestamp: number): Promise<boolean> => {
			focusedMsgTime.value = timestamp;
			props.channel.scrolledToBottom = false;
			isAdjustingWindow.value = true;

			// Find the message index in all messages by time
			const all = allCondensedMessages.value;
			let targetIndex = -1;

			for (let i = 0; i < all.length; i++) {
				const msg = all[i];
				const msgTime = new Date(msg.time).getTime();
				if (Math.abs(msgTime - timestamp) < 1000) {
					targetIndex = i;
					break;
				}
				if (msg.type === "condensed") {
					for (const inner of msg.messages) {
						const innerTime = new Date(inner.time).getTime();
						if (Math.abs(innerTime - timestamp) < 1000) {
							targetIndex = i;
							break;
						}
					}
					if (targetIndex !== -1) break;
				}
			}

			if (targetIndex === -1) {
				isAdjustingWindow.value = false;
				return false;
			}

			// Adjust window to include the target message
			if (all.length > MAX_RENDERED_MESSAGES) {
				const halfWindow = Math.floor(MAX_RENDERED_MESSAGES / 2);
				windowStartIndex.value = Math.max(0, Math.min(
					targetIndex - halfWindow,
					all.length - MAX_RENDERED_MESSAGES
				));
			}

			await nextTick();

			// Find and scroll to the element
			if (chat.value) {
				const messages = chat.value.querySelectorAll(".msg[id^='msg-']");
				for (const el of messages) {
					const msgId = el.id.replace("msg-", "");
					const msg = displayedMessages.value.find(m => {
						if (m.type === "condensed") {
							return m.messages.some(inner => String(inner.id) === msgId);
						}
						return String(m.id) === msgId;
					});

					if (msg) {
						const msgTime = new Date(msg.time).getTime();
						if (Math.abs(msgTime - timestamp) < 1000) {
							isScrolling.value = true;
							el.scrollIntoView({ behavior: "instant", block: "center" });

							setTimeout(() => {
								isScrolling.value = false;
								isAdjustingWindow.value = false;
							}, 50);

							// Clear highlight after a few seconds
							setTimeout(() => {
								focusedMsgTime.value = null;
							}, 3000);

							return true;
						}
					}
				}
			}

			isAdjustingWindow.value = false;
			return false;
		};

		// Handle scroll events - triggers window shifting when near edges
		const handleScroll = () => {
			// Skip if we're doing a programmatic scroll or adjusting the window
			if (isScrolling.value || isAdjustingWindow.value) {
				return;
			}

			const el = chat.value;
			if (!el) return;

			const scrollTop = el.scrollTop;
			const scrollHeight = el.scrollHeight;
			const clientHeight = el.clientHeight;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
			const distanceFromTop = scrollTop;

			// Update scrolledToBottom state - only when actually at the DOM bottom AND at end of messages
			const atDOMBottom = distanceFromBottom <= 30;
			if (atDOMBottom && isAtEnd.value) {
				if (!props.channel.scrolledToBottom) {
					props.channel.scrolledToBottom = true;
				}
			} else if (props.channel.scrolledToBottom && distanceFromBottom > 100) {
				// Only unset if user scrolled significantly away from bottom
				props.channel.scrolledToBottom = false;
			}

			// Dynamic window shifting - shift when user scrolls near edges
			// Shift up (load older) when near top and there are more messages above
			if (distanceFromTop < SCROLL_THRESHOLD && canScrollBack.value) {
				void shiftWindowUp(50);
			}
			// Shift down (load newer) when near bottom but not at end
			else if (distanceFromBottom < SCROLL_THRESHOLD && !isAtEnd.value) {
				void shiftWindowDown(50);
			}
		};

		// Load more from server
		const onShowMoreClick = () => {
			if (!store.state.isConnected) return;

			let lastMessage = -1;
			for (const message of props.channel.messages) {
				if (!message.showInActive) {
					lastMessage = message.id;
					break;
				}
			}

			props.channel.historyLoading = true;
			socket.emit("more", {
				target: props.channel.id,
				lastId: lastMessage,
				condensed: store.state.settings.statusMessages !== "shown",
			});
		};

		const shouldDisplayDateMarker = (
			message: SharedMsg | CondensedMessageContainer,
			idx: number
		) => {
			const previousMessage = displayedMessages.value[idx - 1];

			if (!previousMessage) return true;

			const oldDate = new Date(previousMessage.time);
			const newDate = new Date(message.time);

			return (
				oldDate.getDate() !== newDate.getDate() ||
				oldDate.getMonth() !== newDate.getMonth() ||
				oldDate.getFullYear() !== newDate.getFullYear()
			);
		};

		const shouldDisplayUnreadMarker = (id: number) => {
			if (!unreadMarkerShown && id > props.channel.firstUnread) {
				unreadMarkerShown = true;
				return true;
			}
			return false;
		};

		const isPreviousSource = (currentMessage: ClientMessage, idx: number) => {
			const previousMessage = displayedMessages.value[idx - 1];
			return (
				previousMessage &&
				currentMessage.type === MessageType.MESSAGE &&
				previousMessage.type === MessageType.MESSAGE &&
				currentMessage.from &&
				previousMessage.from &&
				currentMessage.from.nick === previousMessage.from.nick
			);
		};

		const onCopy = () => {
			if (chat.value) {
				clipboard(chat.value);
			}
		};

		const keepScrollPosition = async () => {
			if (props.channel.scrolledToBottom) {
				await jumpToBottom();
				return;
			}

			const el = chat.value;
			if (!el) return;

			// Maintain relative scroll position
			isAdjustingWindow.value = true;
			const scrollBottom = el.scrollHeight - el.scrollTop;
			await nextTick();
			isScrolling.value = true;
			el.scrollTop = el.scrollHeight - scrollBottom;
			setTimeout(() => {
				isScrolling.value = false;
				isAdjustingWindow.value = false;
			}, 50);
		};

		const onLinkPreviewToggle = async (preview: ClientLinkPreview, message: ClientMessage) => {
			await keepScrollPosition();
			socket.emit("msg:preview:toggle", {
				target: props.channel.id,
				msgId: message.id,
				link: preview.link,
				shown: preview.shown,
			});
		};

		const handleResize = () => {
			if (props.channel.scrolledToBottom) {
				void jumpToBottom();
			}
		};

		// Initialize
		onMounted(async () => {
			chat.value?.addEventListener("scroll", handleScroll, { passive: true });
			eventbus.on("resize", handleResize);

			// Handle initial focus from search - try ID first, then time fallback
			if (props.focused && !isNaN(props.focused)) {
				await nextTick();
				await jumpToMessage(props.focused, props.focusedTime);
			} else if (props.focusedTime && !isNaN(props.focusedTime)) {
				await nextTick();
				await jumpToMessageByTime(props.focusedTime);
			} else {
				// Default: scroll to bottom
				props.channel.scrolledToBottom = true;
				windowStartIndex.value = Math.max(0, allCondensedMessages.value.length - MAX_RENDERED_MESSAGES);
				await nextTick();
				scrollToBottom();
			}

			// Set up intersection observer for auto-loading history
			await nextTick();
			if (window.IntersectionObserver && loadMoreButton.value) {
				historyObserver.value = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) {
								onShowMoreClick();
							}
						});
					},
					{ root: chat.value }
				);
				historyObserver.value.observe(loadMoreButton.value);
			}
		});

		// Channel switch - scroll to bottom and reset window
		watch(
			() => props.channel.id,
			async () => {
				props.channel.scrolledToBottom = true;
				focusedMsgId.value = null;
				focusedMsgTime.value = null;
				windowStartIndex.value = Math.max(0, allCondensedMessages.value.length - MAX_RENDERED_MESSAGES);
				await nextTick();
				scrollToBottom();

				if (historyObserver.value && loadMoreButton.value) {
					historyObserver.value.unobserve(loadMoreButton.value);
					historyObserver.value.observe(loadMoreButton.value);
				}
			}
		);

		// Track the first message ID to detect when history is loaded
		const firstMessageId = computed(() => {
			const msgs = props.channel.messages;
			return msgs.length > 0 ? msgs[0].id : null;
		});

		// When history is loaded (messages prepended), adjust window to maintain position
		watch(
			firstMessageId,
			async (newFirstId, oldFirstId) => {
				if (oldFirstId === null || newFirstId === null) return;
				if (newFirstId === oldFirstId) return;

				// History was loaded - messages were prepended
				// Adjust windowStartIndex to keep the same messages visible
				const el = chat.value;
				if (!el) return;

				isAdjustingWindow.value = true;
				const oldScrollTop = el.scrollTop;
				const oldScrollHeight = el.scrollHeight;

				// The window start needs to shift by the number of new messages
				// to keep viewing the same content
				const total = allCondensedMessages.value.length;
				const maxStart = Math.max(0, total - MAX_RENDERED_MESSAGES);

				// If we were viewing the oldest loaded messages, keep the window at 0
				// so the user can see the newly loaded history
				if (windowStartIndex.value === 0) {
					// Don't shift - let user see new history
				} else {
					// Shift the window to compensate for new messages
					windowStartIndex.value = Math.min(maxStart, windowStartIndex.value);
				}

				await nextTick();

				// Restore scroll position
				const newScrollHeight = el.scrollHeight;
				const heightDiff = newScrollHeight - oldScrollHeight;
				isScrolling.value = true;
				el.scrollTop = oldScrollTop + heightDiff;

				setTimeout(() => {
					isScrolling.value = false;
					isAdjustingWindow.value = false;
				}, 50);
			}
		);

		// New messages at the end - stay at bottom if we were at bottom
		watch(
			() => props.channel.messages.length,
			async (newLen, oldLen) => {
				if (props.channel.scrolledToBottom) {
					// Keep window at the end when new messages come in
					const total = allCondensedMessages.value.length;
					windowStartIndex.value = Math.max(0, total - MAX_RENDERED_MESSAGES);
					await nextTick();
					scrollToBottom();
				} else if (oldLen !== undefined && newLen > oldLen) {
					// Messages were added (likely at the end) but we're not at bottom
					// Don't change window or scroll - user is reading history
				}
			}
		);

		// Handle focused message ID (from search results - primary)
		watch(
			() => props.focused,
			async (focused) => {
				if (!focused || isNaN(focused)) return;
				await nextTick();
				await jumpToMessage(focused, props.focusedTime);
			}
		);

		// Handle focused time (from search results - fallback for old messages)
		watch(
			() => props.focusedTime,
			async (focusedTime) => {
				// Only use time if no ID was provided
				if (props.focused && !isNaN(props.focused)) return;
				if (!focusedTime || isNaN(focusedTime)) return;
				await nextTick();
				await jumpToMessageByTime(focusedTime);
			}
		);

		onBeforeUpdate(() => {
			unreadMarkerShown = false;
		});

		onBeforeUnmount(() => {
			eventbus.off("resize", handleResize);
			chat.value?.removeEventListener("scroll", handleScroll);
		});

		onUnmounted(() => {
			historyObserver.value?.disconnect();
		});

		return {
			chat,
			store,
			loadMoreButton,
			displayedMessages,
			showLoadMoreButton,
			getMessageKey,
			isMessageFocused,
			onShowMoreClick,
			onCopy,
			shouldDisplayDateMarker,
			shouldDisplayUnreadMarker,
			keepScrollPosition,
			isPreviousSource,
			jumpToBottom,
			onLinkPreviewToggle,
		};
	},
});
</script>
