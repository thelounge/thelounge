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
			<template v-for="(message, idx) in windowedMessages" :key="getMessageKey(message)">
				<DateMarker
					v-if="shouldDisplayDateMarker(message, idx)"
					:message="message as any"
					:focused="message.id === focusedMsgId"
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
					:focused="message.id === focusedMsgId"
				/>
				<Message
					v-else
					:channel="channel"
					:network="network"
					:message="message"
					:keep-scroll-position="keepScrollPosition"
					:is-previous-source="isPreviousSource(message, idx)"
					:focused="message.id === focusedMsgId"
					@toggle-link-preview="onLinkPreviewToggle"
				/>
			</template>
		</div>
		<!-- Return to latest button -->
		<div v-if="!isAtEnd" class="return-to-latest">
			<button class="btn" @click="jumpToBottom">
				↓ Return to latest
			</button>
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

// TODO; move into component
let unreadMarkerShown = false;

// Configuration
const WINDOW_SIZE = 150; // How many messages to render at once
const SCROLL_THRESHOLD = 150; // Pixels from edge to trigger window shift
const SHIFT_AMOUNT = 25; // How many messages to shift when moving window

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

		// Window state: which index in allMessages to start rendering from
		// We render from windowStart to windowStart + WINDOW_SIZE
		const windowStart = ref(0);

		// Flag to prevent scroll handler from firing during programmatic scrolls
		const ignoreNextScroll = ref(false);

		// Flag to prevent any scroll/watcher interference during jump animations
		const isJumping = ref(false);

		// Track if a window shift is pending (using rAF)
		let pendingWindowShift = false;

		// Target message ID we're trying to jump to (for loading more history)
		const pendingJumpTarget = ref<number | null>(null);

		// The currently focused/highlighted message ID (resolved from either focused or focusedTime)
		const focusedMsgId = ref<number | null>(null);

		// Full condensed message list (can be large)
		const allMessages = computed(() => {
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

		// The slice of messages currently rendered
		const windowedMessages = computed(() => {
			const all = allMessages.value;
			const start = windowStart.value;
			const end = Math.min(start + WINDOW_SIZE, all.length);
			return all.slice(start, end);
		});

		// Are we showing the end of the message list?
		const isAtEnd = computed(() => {
			return windowStart.value + WINDOW_SIZE >= allMessages.value.length;
		});

		// Should we show the "load more" button?
		const showLoadMoreButton = computed(() => {
			// Show if there's more history on server AND we're at the start of our local array
			return props.channel.moreHistoryAvailable && windowStart.value === 0;
		});

		// Helper to get a unique key for each message
		const getMessageKey = (message: ClientMessage | CondensedMessageContainer) => {
			if (message.type === "condensed") {
				return `condensed-${message.messages[0].id}`;
			}
			return message.id;
		};

		// Set window to show the latest messages
		const goToEnd = () => {
			const total = allMessages.value.length;
			windowStart.value = Math.max(0, total - WINDOW_SIZE);
		};

		// Jump to bottom - go to end and scroll down
		const jumpToBottom = async () => {
			goToEnd();
			props.channel.scrolledToBottom = true;

			await nextTick();

			if (chat.value) {
				ignoreNextScroll.value = true;
				chat.value.scrollTop = chat.value.scrollHeight;
			}
		};

		// Find message index by ID in allMessages
		const findMessageIndex = (msgId: number): number => {
			const all = allMessages.value;
			for (let i = 0; i < all.length; i++) {
				const msg = all[i];
				if (msg.id === msgId) return i;
				if (msg.type === "condensed") {
					for (const inner of msg.messages) {
						if (inner.id === msgId) return i;
					}
				}
			}
			return -1;
		};

		// Find message index by timestamp (for search results which have different IDs)
		const findMessageIndexByTime = (timestamp: number): {index: number; msgId: number} => {
			const all = allMessages.value;
			for (let i = 0; i < all.length; i++) {
				const msg = all[i];
				const msgTime = new Date(msg.time).getTime();
				// Allow 1 second tolerance for timestamp matching
				if (Math.abs(msgTime - timestamp) < 1000) {
					return {index: i, msgId: msg.id || 0};
				}
				if (msg.type === "condensed") {
					for (const inner of msg.messages) {
						const innerTime = new Date(inner.time).getTime();
						if (Math.abs(innerTime - timestamp) < 1000) {
							return {index: i, msgId: inner.id};
						}
					}
				}
			}
			return {index: -1, msgId: 0};
		};

		// Jump to a specific message by ID
		const jumpToMessage = async (msgId: number): Promise<boolean> => {
			// Immediately prevent any other scroll interference
			isJumping.value = true;
			props.channel.scrolledToBottom = false;

			const index = findMessageIndex(msgId);

			if (index === -1) {
				// Message not in memory - need to load more history
				if (props.channel.moreHistoryAvailable) {
					// Set target and trigger history load
					pendingJumpTarget.value = msgId;

					// Go to start of window and trigger history loading
					windowStart.value = 0;
					await nextTick();

					if (chat.value) {
						ignoreNextScroll.value = true;
						chat.value.scrollTop = 0;
					}

					// Trigger loading more history
					onShowMoreClick();

					// Keep isJumping true - the messages watcher will handle completion
					return false;
				}

				// No more history available and message not found
				isJumping.value = false;
				return false;
			}

			// Clear any pending jump target since we found the message
			pendingJumpTarget.value = null;

			// Set the focused message ID for highlighting
			focusedMsgId.value = msgId;

			// Center the window on this message
			const total = allMessages.value.length;
			const halfWindow = Math.floor(WINDOW_SIZE / 2);
			let newStart = index - halfWindow;

			// Clamp to valid range
			newStart = Math.max(0, Math.min(newStart, total - WINDOW_SIZE));
			newStart = Math.max(0, newStart); // In case total < WINDOW_SIZE

			windowStart.value = newStart;

			// Wait for Vue to render
			await nextTick();
			await nextTick(); // Double nextTick to ensure DOM is fully updated

			// Find and scroll to the element
			if (chat.value) {
				const el = chat.value.querySelector(`#msg-${msgId}`);
				if (el) {
					// Use instant scroll to avoid animation conflicts
					el.scrollIntoView({ behavior: "instant", block: "center" });

					// Keep isJumping true briefly to let things settle
					setTimeout(() => {
						isJumping.value = false;
					}, 150);

					// Clear the highlight after a few seconds
					setTimeout(() => {
						focusedMsgId.value = null;
					}, 3000);

					return true;
				}
			}

			isJumping.value = false;
			return false;
		};

		// Jump to a specific message by timestamp (for search results)
		const jumpToMessageByTime = async (timestamp: number): Promise<boolean> => {
			// Immediately prevent any other scroll interference
			isJumping.value = true;
			props.channel.scrolledToBottom = false;

			const {index, msgId} = findMessageIndexByTime(timestamp);

			if (index === -1) {
				// Message not in memory - this shouldn't happen often since
				// we load messages from SQLite on startup
				isJumping.value = false;
				return false;
			}

			// Set the focused message ID for highlighting
			focusedMsgId.value = msgId;

			// Center the window on this message
			const total = allMessages.value.length;
			const halfWindow = Math.floor(WINDOW_SIZE / 2);
			let newStart = index - halfWindow;

			// Clamp to valid range
			newStart = Math.max(0, Math.min(newStart, total - WINDOW_SIZE));
			newStart = Math.max(0, newStart);

			windowStart.value = newStart;

			// Wait for Vue to render
			await nextTick();
			await nextTick();

			// Find and scroll to the element
			if (chat.value && msgId) {
				const el = chat.value.querySelector(`#msg-${msgId}`);
				if (el) {
					el.scrollIntoView({ behavior: "instant", block: "center" });

					setTimeout(() => {
						isJumping.value = false;
					}, 150);

					// Clear the highlight after a few seconds
					setTimeout(() => {
						focusedMsgId.value = null;
					}, 3000);

					return true;
				}
			}

			isJumping.value = false;
			return false;
		};

		// Handle scroll - shift window when near edges
		const handleScroll = () => {
			// Skip if we're in the middle of a programmatic jump
			if (isJumping.value) return;

			if (ignoreNextScroll.value) {
				ignoreNextScroll.value = false;
				return;
			}

			const el = chat.value;
			if (!el) return;

			// Always update scrolledToBottom immediately
			const atBottom = el.scrollHeight - el.scrollTop - el.offsetHeight <= 30;
			props.channel.scrolledToBottom = atBottom;

			// Skip window shifting if already pending or not needed
			if (pendingWindowShift) return;

			const total = allMessages.value.length;
			if (total <= WINDOW_SIZE) return;

			const currentStart = windowStart.value;
			const currentEnd = currentStart + WINDOW_SIZE;
			const scrollTop = el.scrollTop;
			const scrollBottom = el.scrollHeight - scrollTop;
			const distanceFromBottom = el.scrollHeight - scrollTop - el.offsetHeight;

			// Check if we need to shift
			const needsShiftUp = scrollTop < SCROLL_THRESHOLD && currentStart > 0;
			const needsShiftDown = distanceFromBottom < SCROLL_THRESHOLD && currentEnd < total;

			if (!needsShiftUp && !needsShiftDown) return;

			// Use rAF for smooth window shifting
			pendingWindowShift = true;
			requestAnimationFrame(() => {
				pendingWindowShift = false;
				if (isJumping.value) return;

				const el = chat.value;
				if (!el) return;

				// Re-check conditions (scroll may have changed)
				const currentStart = windowStart.value;
				const currentEnd = currentStart + WINDOW_SIZE;

				if (needsShiftUp && currentStart > 0) {
					const scrollBottom = el.scrollHeight - el.scrollTop;
					const newStart = Math.max(0, currentStart - SHIFT_AMOUNT);
					windowStart.value = newStart;

					// Maintain scroll position after DOM update
					void nextTick(() => {
						ignoreNextScroll.value = true;
						el.scrollTop = el.scrollHeight - scrollBottom;
					});
				} else if (needsShiftDown && currentEnd < total) {
					const scrollTop = el.scrollTop;
					const oldHeight = el.scrollHeight;
					const newStart = Math.min(total - WINDOW_SIZE, currentStart + SHIFT_AMOUNT);
					windowStart.value = newStart;

					// Maintain scroll position after DOM update
					void nextTick(() => {
						ignoreNextScroll.value = true;
						const heightDiff = oldHeight - el.scrollHeight;
						el.scrollTop = scrollTop - heightDiff;
					});
				}
			});
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

		// For date markers - need to check against allMessages for correct previous message
		const shouldDisplayDateMarker = (
			message: SharedMsg | CondensedMessageContainer,
			windowIdx: number
		) => {
			const absoluteIdx = windowStart.value + windowIdx;
			const previousMessage = allMessages.value[absoluteIdx - 1];

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

		const isPreviousSource = (currentMessage: ClientMessage, windowIdx: number) => {
			const absoluteIdx = windowStart.value + windowIdx;
			const previousMessage = allMessages.value[absoluteIdx - 1];
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
			// Only relevant when loading history
			if (!props.channel.historyLoading) {
				if (props.channel.scrolledToBottom) {
					await jumpToBottom();
				}
				return;
			}

			const el = chat.value;
			if (!el) return;

			const scrollBottom = el.scrollHeight - el.scrollTop;
			await nextTick();
			ignoreNextScroll.value = true;
			el.scrollTop = el.scrollHeight - scrollBottom;
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

			// If we have a focused time (from search), jump by time
			// If we have a focused ID, jump by ID
			// Otherwise go to end
			if (props.focusedTime && !isNaN(props.focusedTime)) {
				await jumpToMessageByTime(props.focusedTime);
			} else if (props.focused && !isNaN(props.focused)) {
				const success = await jumpToMessage(props.focused);
				if (!success && props.channel.moreHistoryAvailable && chat.value) {
					// Message not in memory, scroll to top to prompt loading more
					windowStart.value = 0;
					await nextTick();
					ignoreNextScroll.value = true;
					chat.value.scrollTop = 0;
				}
			} else {
				goToEnd();

				await nextTick();
				if (chat.value) {
					ignoreNextScroll.value = true;
					chat.value.scrollTop = chat.value.scrollHeight;
				}
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

		// Channel switch - reset to end
		watch(
			() => props.channel.id,
			() => {
				props.channel.scrolledToBottom = true;
				goToEnd();

				void nextTick(() => {
					if (chat.value) {
						ignoreNextScroll.value = true;
						chat.value.scrollTop = chat.value.scrollHeight;
					}

					if (historyObserver.value && loadMoreButton.value) {
						historyObserver.value.unobserve(loadMoreButton.value);
						historyObserver.value.observe(loadMoreButton.value);
					}
				});
			}
		);

		// New messages - stay at bottom if we were at bottom, or handle pending jump
		watch(
			() => props.channel.messages.length,
			async () => {
				// Check if we're waiting to jump to a specific message
				if (pendingJumpTarget.value !== null) {
					const targetId = pendingJumpTarget.value;
					const index = findMessageIndex(targetId);

					if (index !== -1) {
						// Found the message! Jump to it
						await jumpToMessage(targetId);
					} else if (props.channel.moreHistoryAvailable && !props.channel.historyLoading) {
						// Still not found, keep loading more
						onShowMoreClick();
					} else if (!props.channel.moreHistoryAvailable) {
						// No more history to load, give up
						pendingJumpTarget.value = null;
						isJumping.value = false;
					}
					return;
				}

				// Don't interfere if we're jumping to a specific message
				if (isJumping.value) return;

				if (props.channel.scrolledToBottom) {
					await jumpToBottom();
				}
			}
		);

		// Handle focused message (from search/mentions)
		// Note: Not immediate - we handle initial focus in onMounted after DOM is ready
		watch(
			() => props.focused,
			async (focusedId) => {
				if (!focusedId) return;

				const success = await jumpToMessage(focusedId);
				if (!success && props.channel.moreHistoryAvailable && chat.value) {
					// Message not in memory, scroll to top to prompt loading more
					windowStart.value = 0;
					await nextTick();
					ignoreNextScroll.value = true;
					chat.value.scrollTop = 0;
				}
			}
		);

		// Handle focused time (from search results)
		watch(
			() => props.focusedTime,
			async (focusedTime) => {
				if (!focusedTime || isNaN(focusedTime)) return;
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
			windowedMessages,
			showLoadMoreButton,
			isAtEnd,
			focusedMsgId,
			getMessageKey,
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
