<template>
	<div ref="chat" class="chat" tabindex="-1" @scroll="onScroll">
		<div v-show="channel.moreHistoryAvailable" class="show-more">
			<button
				ref="loadMoreButton"
				:disabled="isLoadingHistory || !store.state.isConnected"
				class="btn"
				@click="loadMoreHistory"
			>
				<span v-if="isLoadingHistory">Loading…</span>
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
			<template v-for="(message, idx) in displayMessages" :key="getMessageKey(message)">
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

		// === STATE ===
		// Operation flags - only one should be true at a time
		const isLoadingHistory = ref(false);
		const isJumpingToMessage = ref(false);

		// Scroll state
		const isAtBottom = ref(true);
		const scrollStateBeforeHistoryLoad = ref<{scrollHeight: number; scrollTop: number} | null>(null);

		// Focus state for highlighting messages
		const focusedMsgId = ref<number | null>(null);
		const focusedMsgTime = ref<number | null>(null);

		// Scroll tracking with debounce
		let scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;

		// === COMPUTED: Build display messages with condensing ===
		const displayMessages = computed(() => {
			const messages = props.channel.messages;

			if (props.channel.type !== ChanType.CHANNEL && props.channel.type !== ChanType.QUERY) {
				return messages;
			}

			const statusSetting = store.state.settings.statusMessages;

			if (statusSetting === "hidden") {
				return messages.filter(m => !condensedTypes.has(m.type || ""));
			}

			if (statusSetting !== "condensed") {
				return messages;
			}

			// Condense consecutive status messages
			const result: (ClientMessage | CondensedMessageContainer)[] = [];
			let currentCondensed: CondensedMessageContainer | null = null;

			for (const message of messages) {
				// Don't condense self messages, highlights, or non-status types
				if (message.self || message.highlight || !condensedTypes.has(message.type || "")) {
					currentCondensed = null;
					result.push(message);
					continue;
				}

				if (!currentCondensed) {
					currentCondensed = {
						type: "condensed",
						time: message.time,
						messages: [],
					};
					result.push(currentCondensed);
				}

				currentCondensed.messages.push(message);
				currentCondensed.id = message.id;

				// Break condensing at unread marker
				if (message.id === props.channel.firstUnread) {
					currentCondensed = null;
				}
			}

			// Convert single-message condensed groups back to regular messages
			return result.map(item => {
				if (item.type === "condensed" && item.messages.length === 1) {
					return item.messages[0];
				}
				return item;
			});
		});

		// === SCROLL UTILITIES ===
		const scrollToBottom = () => {
			const el = chat.value;
			if (el) {
				el.scrollTop = el.scrollHeight;
			}
		};

		const updateIsAtBottom = () => {
			const el = chat.value;
			if (!el) return;

			const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
			// Use 50px threshold - more forgiving than 30px
			isAtBottom.value = distanceFromBottom <= 50;
			props.channel.scrolledToBottom = isAtBottom.value;
		};

		const onScroll = () => {
			// Debounce scroll updates to avoid excessive state changes
			if (scrollDebounceTimer) {
				clearTimeout(scrollDebounceTimer);
			}
			scrollDebounceTimer = setTimeout(() => {
				updateIsAtBottom();
			}, 16); // ~60fps
		};

		// === HISTORY LOADING ===
		const loadMoreHistory = () => {
			if (!store.state.isConnected || isLoadingHistory.value) return;

			// Find the oldest message ID
			let oldestId = -1;
			for (const message of props.channel.messages) {
				if (!message.showInActive) {
					oldestId = message.id;
					break;
				}
			}

			// Save scroll state before loading
			const el = chat.value;
			if (el) {
				scrollStateBeforeHistoryLoad.value = {
					scrollHeight: el.scrollHeight,
					scrollTop: el.scrollTop,
				};
			}

			isLoadingHistory.value = true;
			props.channel.historyLoading = true;

			socket.emit("more", {
				target: props.channel.id,
				lastId: oldestId,
				condensed: store.state.settings.statusMessages !== "shown",
			});
		};

		// Called when history is loaded (from socket event via channel.historyLoading change)
		const onHistoryLoaded = async () => {
			if (!scrollStateBeforeHistoryLoad.value) {
				isLoadingHistory.value = false;
				return;
			}

			await nextTick();

			const el = chat.value;
			if (el) {
				const {scrollHeight: oldHeight, scrollTop: oldTop} = scrollStateBeforeHistoryLoad.value;
				const newHeight = el.scrollHeight;
				// Maintain scroll position relative to content
				el.scrollTop = oldTop + (newHeight - oldHeight);
			}

			scrollStateBeforeHistoryLoad.value = null;
			isLoadingHistory.value = false;
		};

		// === JUMP TO MESSAGE ===
		const jumpToMessage = async (msgId: number, fallbackTime?: number): Promise<boolean> => {
			isJumpingToMessage.value = true;
			focusedMsgId.value = msgId;
			focusedMsgTime.value = fallbackTime || null;

			await nextTick();

			const el = chat.value;
			if (!el) {
				isJumpingToMessage.value = false;
				return false;
			}

			// Try to find by ID first
			const msgEl = el.querySelector(`#msg-${msgId}`) as HTMLElement;
			if (msgEl) {
				msgEl.scrollIntoView({behavior: "instant", block: "center"});
				clearFocusAfterDelay();
				isJumpingToMessage.value = false;
				return true;
			}

			// Fallback: try to find by time
			if (fallbackTime) {
				const found = await jumpToMessageByTime(fallbackTime);
				isJumpingToMessage.value = false;
				return found;
			}

			isJumpingToMessage.value = false;
			return false;
		};

		const jumpToMessageByTime = async (timestamp: number): Promise<boolean> => {
			focusedMsgTime.value = timestamp;

			await nextTick();

			const el = chat.value;
			if (!el) return false;

			// Find message closest to timestamp
			const msgElements = el.querySelectorAll(".msg[id^='msg-']");
			let closestEl: HTMLElement | null = null;
			let closestDiff = Infinity;

			for (const msgEl of msgElements) {
				const idStr = msgEl.id.replace("msg-", "");
				const msg = findMessageById(parseInt(idStr, 10));
				if (msg) {
					const msgTime = new Date(msg.time).getTime();
					const diff = Math.abs(msgTime - timestamp);
					if (diff < closestDiff) {
						closestDiff = diff;
						closestEl = msgEl as HTMLElement;
					}
				}
			}

			if (closestEl && closestDiff < 60000) { // Within 1 minute
				closestEl.scrollIntoView({behavior: "instant", block: "center"});
				clearFocusAfterDelay();
				return true;
			}

			return false;
		};

		const findMessageById = (id: number): ClientMessage | null => {
			for (const msg of props.channel.messages) {
				if (msg.id === id) return msg;
			}
			return null;
		};

		const clearFocusAfterDelay = () => {
			setTimeout(() => {
				focusedMsgId.value = null;
				focusedMsgTime.value = null;
			}, 3000);
		};

		const jumpToBottom = async () => {
			isAtBottom.value = true;
			props.channel.scrolledToBottom = true;
			await nextTick();
			scrollToBottom();
		};

		// === MESSAGE DISPLAY HELPERS ===
		const getMessageKey = (message: ClientMessage | CondensedMessageContainer) => {
			if (message.type === "condensed") {
				return `condensed-${message.messages[0]?.id}-${message.messages.length}`;
			}
			return `msg-${message.id}`;
		};

		const isMessageFocused = (message: ClientMessage | CondensedMessageContainer): boolean => {
			if (focusedMsgId.value !== null) {
				if (message.type === "condensed") {
					return message.messages.some(m => m.id === focusedMsgId.value);
				}
				return message.id === focusedMsgId.value;
			}

			if (focusedMsgTime.value) {
				const msgTime = new Date(message.time).getTime();
				if (Math.abs(msgTime - focusedMsgTime.value) < 1000) {
					return true;
				}
				if (message.type === "condensed") {
					return message.messages.some(m => {
						const t = new Date(m.time).getTime();
						return Math.abs(t - focusedMsgTime.value!) < 1000;
					});
				}
			}

			return false;
		};

		const shouldDisplayDateMarker = (message: SharedMsg | CondensedMessageContainer, idx: number) => {
			const prev = displayMessages.value[idx - 1];
			if (!prev) return true;

			const oldDate = new Date(prev.time);
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
			const prev = displayMessages.value[idx - 1];
			return (
				prev &&
				currentMessage.type === MessageType.MESSAGE &&
				prev.type === MessageType.MESSAGE &&
				currentMessage.from &&
				prev.from &&
				currentMessage.from.nick === prev.from.nick
			);
		};

		const onCopy = () => {
			if (chat.value) {
				clipboard(chat.value);
			}
		};

		const keepScrollPosition = async () => {
			if (isAtBottom.value) {
				await nextTick();
				scrollToBottom();
			}
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
			if (isAtBottom.value) {
				scrollToBottom();
			}
		};

		// === WATCHERS ===

		// Watch for history loading completion
		watch(
			() => props.channel.historyLoading,
			(loading, wasLoading) => {
				if (wasLoading && !loading) {
					onHistoryLoaded();
				}
			}
		);

		// Watch for new messages - auto-scroll if at bottom
		watch(
			() => props.channel.messages.length,
			async (newLen, oldLen) => {
				// Skip if no previous value or if we're loading history
				if (oldLen === undefined || isLoadingHistory.value) return;

				// New messages added at end - scroll to bottom if we were at bottom
				if (newLen > oldLen && isAtBottom.value && !isJumpingToMessage.value) {
					await nextTick();
					scrollToBottom();
				}
			}
		);

		// Watch for channel switch
		watch(
			() => props.channel.id,
			async () => {
				// Reset state for new channel
				isLoadingHistory.value = false;
				isJumpingToMessage.value = false;
				scrollStateBeforeHistoryLoad.value = null;
				focusedMsgId.value = null;
				focusedMsgTime.value = null;
				isAtBottom.value = true;
				props.channel.scrolledToBottom = true;

				await nextTick();
				scrollToBottom();
			}
		);

		// Watch for focused message prop (from search/notification navigation)
		watch(
			() => props.focused,
			async (focused) => {
				if (focused && !isNaN(focused)) {
					await nextTick();
					await jumpToMessage(focused, props.focusedTime);
				}
			}
		);

		// === LIFECYCLE ===
		onMounted(async () => {
			eventbus.on("resize", handleResize);

			// Handle initial focus from route
			if (props.focused && !isNaN(props.focused)) {
				await nextTick();
				await jumpToMessage(props.focused, props.focusedTime);
			} else if (props.focusedTime && !isNaN(props.focusedTime)) {
				await nextTick();
				await jumpToMessageByTime(props.focusedTime);
			} else {
				// Default: scroll to bottom
				isAtBottom.value = true;
				props.channel.scrolledToBottom = true;
				await nextTick();
				scrollToBottom();
			}
		});

		onBeforeUpdate(() => {
			unreadMarkerShown = false;
		});

		onBeforeUnmount(() => {
			eventbus.off("resize", handleResize);
			if (scrollDebounceTimer) {
				clearTimeout(scrollDebounceTimer);
			}
		});

		return {
			chat,
			store,
			loadMoreButton,
			displayMessages,
			isLoadingHistory,
			getMessageKey,
			isMessageFocused,
			loadMoreHistory,
			onScroll,
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
