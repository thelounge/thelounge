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
			<template v-for="(message, idx) in condensedMessages" :key="getMessageKey(message)">
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

		// The currently focused/highlighted message
		const focusedMsgId = ref<number | null>(null);
		const focusedMsgTime = ref<number | null>(null);

		// Build condensed message list - render ALL messages, no windowing
		const condensedMessages = computed(() => {
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

		// Should we show the "load more" button?
		const showLoadMoreButton = computed(() => {
			return props.channel.moreHistoryAvailable;
		});

		// Helper to get a unique key for each message
		const getMessageKey = (message: ClientMessage | CondensedMessageContainer) => {
			if (message.type === "condensed") {
				return `condensed-${message.messages[0]?.id}-${new Date(message.time).getTime()}`;
			}
			return `${message.id}-${new Date(message.time).getTime()}`;
		};

		// Check if a message is focused
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
			if (Math.abs(msgTime - focusedMsgTime.value) < 1000) {
				return true;
			}

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

		// Simple scroll to bottom
		const scrollToBottom = () => {
			if (chat.value) {
				chat.value.scrollTop = chat.value.scrollHeight;
			}
		};

		// Jump to bottom
		const jumpToBottom = async () => {
			props.channel.scrolledToBottom = true;
			await nextTick();
			scrollToBottom();
		};

		// Jump to a specific message by ID
		const jumpToMessage = async (msgId: number, fallbackTime?: number): Promise<boolean> => {
			focusedMsgId.value = msgId;
			focusedMsgTime.value = fallbackTime || null;
			props.channel.scrolledToBottom = false;

			await nextTick();

			// Find and scroll to the element
			if (chat.value) {
				const el = chat.value.querySelector(`#msg-${msgId}`) as HTMLElement;
				if (el) {
					el.scrollIntoView({ behavior: "instant", block: "center" });

					// Clear highlight after a few seconds
					setTimeout(() => {
						focusedMsgId.value = null;
						focusedMsgTime.value = null;
					}, 3000);

					return true;
				}
			}

			// If not found by ID, try by time
			if (fallbackTime) {
				return jumpToMessageByTime(fallbackTime);
			}

			return false;
		};

		// Jump to a message by timestamp
		const jumpToMessageByTime = async (timestamp: number): Promise<boolean> => {
			focusedMsgTime.value = timestamp;
			props.channel.scrolledToBottom = false;

			await nextTick();

			if (chat.value) {
				const messages = chat.value.querySelectorAll(".msg[id^='msg-']");
				for (const el of messages) {
					const msgId = el.id.replace("msg-", "");
					const msg = condensedMessages.value.find(m => {
						if (m.type === "condensed") {
							return m.messages.some(inner => String(inner.id) === msgId);
						}
						return String(m.id) === msgId;
					});

					if (msg) {
						const msgTime = new Date(msg.time).getTime();
						if (Math.abs(msgTime - timestamp) < 1000) {
							el.scrollIntoView({ behavior: "instant", block: "center" });

							setTimeout(() => {
								focusedMsgTime.value = null;
							}, 3000);

							return true;
						}
					}
				}
			}

			return false;
		};

		// Handle scroll events - just track if at bottom
		const handleScroll = () => {
			const el = chat.value;
			if (!el) return;

			const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
			props.channel.scrolledToBottom = distanceFromBottom <= 30;
		};

		// Load more history from server
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
			const previousMessage = condensedMessages.value[idx - 1];

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
			const previousMessage = condensedMessages.value[idx - 1];
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

			// Maintain scroll position from bottom
			const scrollFromBottom = el.scrollHeight - el.scrollTop;
			await nextTick();
			el.scrollTop = el.scrollHeight - scrollFromBottom;
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
				scrollToBottom();
			}
		};

		// Initialize
		onMounted(async () => {
			chat.value?.addEventListener("scroll", handleScroll, { passive: true });
			eventbus.on("resize", handleResize);

			// Handle initial focus from search
			if (props.focused && !isNaN(props.focused)) {
				await nextTick();
				await jumpToMessage(props.focused, props.focusedTime);
			} else if (props.focusedTime && !isNaN(props.focusedTime)) {
				await nextTick();
				await jumpToMessageByTime(props.focusedTime);
			} else {
				// Default: scroll to bottom
				props.channel.scrolledToBottom = true;
				await nextTick();
				scrollToBottom();
			}

			// Set up intersection observer for auto-loading history
			if (window.IntersectionObserver && loadMoreButton.value) {
				historyObserver.value = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting && !props.channel.historyLoading) {
								onShowMoreClick();
							}
						});
					},
					{ root: chat.value }
				);
				historyObserver.value.observe(loadMoreButton.value);
			}
		});

		// Channel switch - reset and scroll to bottom
		watch(
			() => props.channel.id,
			async () => {
				props.channel.scrolledToBottom = true;
				focusedMsgId.value = null;
				focusedMsgTime.value = null;
				await nextTick();
				scrollToBottom();

				// Re-observe the load more button for new channel
				if (historyObserver.value && loadMoreButton.value) {
					historyObserver.value.disconnect();
					historyObserver.value.observe(loadMoreButton.value);
				}
			}
		);

		// When history is loaded, preserve scroll position
		watch(
			() => props.channel.messages[0]?.id,
			async (newFirstId, oldFirstId) => {
				if (oldFirstId === undefined || newFirstId === oldFirstId) return;

				// History was prepended - keep scroll position
				const el = chat.value;
				if (!el || props.channel.scrolledToBottom) return;

				const oldScrollHeight = el.scrollHeight;
				const oldScrollTop = el.scrollTop;

				await nextTick();

				// Restore position relative to bottom
				const newScrollHeight = el.scrollHeight;
				el.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
			}
		);

		// New messages - auto-scroll if at bottom
		watch(
			() => props.channel.messages.length,
			async (newLen, oldLen) => {
				if (oldLen === undefined) return;

				// Only auto-scroll for new messages (not history load)
				if (newLen > oldLen && props.channel.scrolledToBottom) {
					await nextTick();
					scrollToBottom();
				}
			}
		);

		// Handle focused message from route
		watch(
			() => props.focused,
			async (focused) => {
				if (!focused || isNaN(focused)) return;
				await nextTick();
				await jumpToMessage(focused, props.focusedTime);
			}
		);

		watch(
			() => props.focusedTime,
			async (focusedTime) => {
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
			condensedMessages,
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
