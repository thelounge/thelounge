<template>
	<div ref="chat" class="chat" tabindex="-1">
		<div v-show="channel.moreHistoryAvailable" class="show-more">
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
			<template v-for="(message, id) in condensedMessages">
				<DateMarker
					v-if="shouldDisplayDateMarker(message, id)"
					:key="message.id + '-date'"
					:message="message as any"
					:focused="message.id === focused"
				/>
				<div
					v-if="shouldDisplayUnreadMarker(Number(message.id))"
					:key="message.id + '-unread'"
					class="unread-marker"
				>
					<span class="unread-marker-text" />
				</div>

				<MessageCondensed
					v-if="message.type === 'condensed'"
					:key="message.messages[0].id"
					:network="network"
					:keep-scroll-position="keepScrollPosition"
					:messages="message.messages"
					:focused="message.id === focused"
				/>
				<Message
					v-else
					:key="message.id"
					:channel="channel"
					:network="network"
					:message="message"
					:keep-scroll-position="keepScrollPosition"
					:is-previous-source="isPreviousSource(message, id)"
					:focused="message.id === focused"
					@toggle-link-preview="onLinkPreviewToggle"
				/>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import {condensedTypes} from "../../shared/irc";
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
import Msg from "../../server/models/msg";

type CondensedMessageContainer = {
	type: "condensed";
	time: Date;
	messages: ClientMessage[];
	id?: number;
};

// TODO; move into component
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
	},
	setup(props, {emit}) {
		const store = useStore();

		const chat = ref<HTMLDivElement | null>(null);
		const loadMoreButton = ref<HTMLButtonElement | null>(null);
		const historyObserver = ref<IntersectionObserver | null>(null);
		const skipNextScrollEvent = ref(false);

		const isWaitingForNextTick = ref(false);

		const jumpToBottom = () => {
			skipNextScrollEvent.value = true;
			props.channel.scrolledToBottom = true;

			const el = chat.value;

			if (el) {
				el.scrollTop = el.scrollHeight;
			}
		};

		const onShowMoreClick = () => {
			if (!store.state.isConnected) {
				return;
			}

			let lastMessage = -1;

			// Find the id of first message that isn't showInActive
			// If showInActive is set, this message is actually in another channel
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

		const onLoadButtonObserved = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				onShowMoreClick();
			});
		};

		nextTick(() => {
			if (!chat.value) {
				return;
			}

			if (window.IntersectionObserver) {
				historyObserver.value = new window.IntersectionObserver(onLoadButtonObserved, {
					root: chat.value,
				});
			}

			jumpToBottom();
		}).catch((e) => {
			// eslint-disable-next-line no-console
			console.error("Error in new IntersectionObserver", e);
		});

		const condensedMessages = computed(() => {
			if (props.channel.type !== "channel" && props.channel.type !== "query") {
				return props.channel.messages;
			}

			// If actions are hidden, just return a message list with them excluded
			if (store.state.settings.statusMessages === "hidden") {
				return props.channel.messages.filter(
					(message) => !condensedTypes.has(message.type)
				);
			}

			// If actions are not condensed, just return raw message list
			if (store.state.settings.statusMessages !== "condensed") {
				return props.channel.messages;
			}

			let lastCondensedContainer: CondensedMessageContainer | null = null;

			const condensed: (ClientMessage | CondensedMessageContainer)[] = [];

			for (const message of props.channel.messages) {
				// If this message is not condensable, or its an action affecting our user,
				// then just append the message to container and be done with it
				if (message.self || message.highlight || !condensedTypes.has(message.type)) {
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

				lastCondensedContainer!.messages.push(message);

				// Set id of the condensed container to last message id,
				// which is required for the unread marker to work correctly
				lastCondensedContainer!.id = message.id;

				// If this message is the unread boundary, create a split condensed container
				if (message.id === props.channel.firstUnread) {
					lastCondensedContainer = null;
				}
			}

			return condensed.map((message) => {
				// Skip condensing single messages, it doesn't save any
				// space but makes useful information harder to see
				if (message.type === "condensed" && message.messages.length === 1) {
					return message.messages[0];
				}

				return message;
			});
		});

		const shouldDisplayDateMarker = (
			message: Msg | ClientMessage | CondensedMessageContainer,
			id: number
		) => {
			const previousMessage = condensedMessages.value[id - 1];

			if (!previousMessage) {
				return true;
			}

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

		const isPreviousSource = (currentMessage: ClientMessage | Msg, id: number) => {
			const previousMessage = condensedMessages.value[id - 1];
			return !!(
				previousMessage &&
				currentMessage.type === "message" &&
				previousMessage.type === "message" &&
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
			// If we are already waiting for the next tick to force scroll position,
			// we have no reason to perform more checks and set it again in the next tick
			if (isWaitingForNextTick.value) {
				return;
			}

			const el = chat.value;

			if (!el) {
				return;
			}

			if (!props.channel.scrolledToBottom) {
				if (props.channel.historyLoading) {
					const heightOld = el.scrollHeight - el.scrollTop;

					isWaitingForNextTick.value = true;

					await nextTick();

					isWaitingForNextTick.value = false;
					skipNextScrollEvent.value = true;

					el.scrollTop = el.scrollHeight - heightOld;
				}

				return;
			}

			isWaitingForNextTick.value = true;
			await nextTick();
			isWaitingForNextTick.value = false;

			jumpToBottom();
		};

		const onLinkPreviewToggle = async (preview: ClientLinkPreview, message: ClientMessage) => {
			await keepScrollPosition();

			// Tell the server we're toggling so it remembers at page reload
			socket.emit("msg:preview:toggle", {
				target: props.channel.id,
				msgId: message.id,
				link: preview.link,
				shown: preview.shown,
			});
		};

		const handleScroll = () => {
			// Setting scrollTop also triggers scroll event
			// We don't want to perform calculations for that
			if (skipNextScrollEvent.value) {
				skipNextScrollEvent.value = false;
				return;
			}

			const el = chat.value;

			if (!el) {
				return;
			}

			props.channel.scrolledToBottom = el.scrollHeight - el.scrollTop - el.offsetHeight <= 30;
		};

		const handleResize = () => {
			// Keep message list scrolled to bottom on resize
			if (props.channel.scrolledToBottom) {
				jumpToBottom();
			}
		};

		onMounted(() => {
			chat.value?.addEventListener("scroll", handleScroll, {passive: true});

			eventbus.on("resize", handleResize);

			void nextTick(() => {
				if (historyObserver.value && loadMoreButton.value) {
					historyObserver.value.observe(loadMoreButton.value);
				}
			});
		});

		watch(
			() => props.channel.id,
			() => {
				props.channel.scrolledToBottom = true;

				// Re-add the intersection observer to trigger the check again on channel switch
				// Otherwise if last channel had the button visible, switching to a new channel won't trigger the history
				if (historyObserver.value && loadMoreButton.value) {
					historyObserver.value.unobserve(loadMoreButton.value);
					historyObserver.value.observe(loadMoreButton.value);
				}
			}
		);

		watch(
			() => props.channel.messages,
			async () => {
				await keepScrollPosition();
			},
			{
				deep: true,
			}
		);

		watch(
			() => props.channel.pendingMessage,
			async () => {
				// Keep the scroll stuck when input gets resized while typing
				await keepScrollPosition();
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
			if (historyObserver.value) {
				historyObserver.value.disconnect();
			}
		});

		return {
			chat,
			store,
			onShowMoreClick,
			loadMoreButton,
			onCopy,
			condensedMessages,
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
