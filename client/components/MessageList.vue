<template>
	<div
		ref="chat"
		class="chat"
	>
		<div :class="['show-more', { show: channel.moreHistoryAvailable }]">
			<button
				ref="loadMoreButton"
				:disabled="channel.historyLoading || !$root.connected"
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
				<div
					v-if="shouldDisplayDateMarker(message, id)"
					:key="message.id + '-date'"
					:data-time="message.time"
					:aria-label="message.time | localedate"
					class="date-marker-container tooltipped tooltipped-s"
				>
					<div class="date-marker">
						<span
							:data-label="message.time | friendlydate"
							class="date-marker-text"/>
					</div>
				</div>
				<div
					v-if="shouldDisplayUnreadMarker(id)"
					:key="message.id + '-unread'"
					class="unread-marker"
				>
					<span class="unread-marker-text"/>
				</div>

				<MessageCondensed
					v-if="message.type === 'condensed'"
					:key="message.id"
					:messages="message.messages"/>
				<Message
					v-else
					:message="message"
					:key="message.id"
					:keep-scroll-position="keepScrollPosition"
					@linkPreviewToggle="onLinkPreviewToggle"/>
			</template>
		</div>
	</div>
</template>

<script>
require("intersection-observer");
const debounce = require("lodash/debounce");

const constants = require("../js/constants");
const clipboard = require("../js/clipboard");
import socket from "../js/socket";
import Message from "./Message.vue";
import MessageCondensed from "./MessageCondensed.vue";

export default {
	name: "MessageList",
	components: {
		Message,
		MessageCondensed,
	},
	props: {
		channel: Object,
	},
	computed: {
		condensedMessages() {
			if (this.channel.type !== "channel") {
				return this.channel.messages;
			}

			const condensed = [];
			let lastCondensedContainer = null;

			for (const message of this.channel.messages) {
				// If this message is not condensable, or its an action affecting our user,
				// then just append the message to container and be done with it
				if (message.self || message.highlight || !constants.condensedTypes.includes(message.type)) {
					lastCondensedContainer = null;

					condensed.push(message);

					continue;
				}

				if (lastCondensedContainer === null) {
					lastCondensedContainer = {
						id: message.id, // Use id of first message in the condensed container
						time: message.time,
						type: "condensed",
						messages: [],
					};

					condensed.push(lastCondensedContainer);
				}

				lastCondensedContainer.messages.push(message);
			}

			return condensed;
		},
	},
	watch: {
		"channel.id"() {
			this.$set(this.link, "scrolledToBottom", true);
		},
		"channel.messages"() {
			this.keepScrollPosition();
		},
	},
	created() {
		this.$nextTick(() => {
			if (!this.$refs.chat) {
				return;
			}

			if (window.IntersectionObserver) {
				this.historyObserver = new window.IntersectionObserver(this.onLoadButtonObserved, {
					root: this.$refs.chat,
				});
			}

			this.channel.scrolledToBottom = true;
			this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
		});
	},
	mounted() {
		this.debouncedResize = debounce(this.handleResize, 50);
		this.debouncedScroll = debounce(this.handleScroll, 50);

		window.addEventListener("resize", this.debouncedResize, {passive: true});
		this.$refs.chat.addEventListener("scroll", this.debouncedScroll, {passive: true});

		this.$nextTick(() => {
			if (this.historyObserver) {
				this.historyObserver.observe(this.$refs.loadMoreButton);
			}
		});
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.debouncedResize);
		this.$refs.chat.removeEventListener("scroll", this.debouncedScroll);
	},
	destroyed() {
		if (this.historyObserver) {
			this.historyObserver.disconnect();
		}
	},
	methods: {
		shouldDisplayDateMarker(message, id) {
			const previousMessage = this.condensedMessages[id - 1];

			if (!previousMessage) {
				return true;
			}

			return (new Date(previousMessage.time)).getDay() !== (new Date(message.time)).getDay();
		},
		shouldDisplayUnreadMarker(id) {
			const previousMessage = this.condensedMessages[id - 1];

			if (!previousMessage) {
				return false;
			}

			return this.channel.firstUnread === previousMessage.id;
		},
		onCopy() {
			clipboard(this.$el);
		},
		onLinkPreviewToggle(preview, message) {
			// Tell the server we're toggling so it remembers at page reload
			// TODO Avoid sending many single events when using `/collapse` or `/expand`
			// See https://github.com/thelounge/thelounge/issues/1377
			socket.emit("msg:preview:toggle", {
				target: this.channel.id,
				msgId: message.id,
				link: preview.link,
				shown: preview.shown,
			});
		},
		onShowMoreClick() {
			let lastMessage = this.channel.messages[0];
			lastMessage = lastMessage ? lastMessage.id : -1;

			this.$set(this.channel, "historyLoading", true);

			socket.emit("more", {
				target: this.channel.id,
				lastId: lastMessage,
			});
		},
		onLoadButtonObserved(entries) {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.click();
			});
		},
		keepScrollPosition() {
			// If we are already waiting for the next tick to force scroll position,
			// we have no reason to perform more checks and set it again in the next tick
			if (this.isWaitingForNextTick) {
				return;
			}

			const el = this.$refs.chat;

			if (!el) {
				return;
			}

			if (!this.channel.scrolledToBottom) {
				if (this.channel.historyLoading) {
					const heightOld = el.scrollHeight - el.scrollTop;

					this.isWaitingForNextTick = true;
					this.$nextTick(() => {
						this.isWaitingForNextTick = false;
						el.scrollTop = el.scrollHeight - heightOld;
					});
				}

				return;
			}

			this.isWaitingForNextTick = true;
			this.$nextTick(() => {
				this.isWaitingForNextTick = false;
				el.scrollTop = el.scrollHeight;
			});
		},
		handleScroll() {
			const el = this.$refs.chat;

			if (!el) {
				return;
			}

			this.channel.scrolledToBottom = el.scrollHeight - el.scrollTop - el.offsetHeight <= 30;
		},
		handleResize() {
			// Keep message list scrolled to bottom on resize
			const el = this.$refs.chat;

			if (el && this.channel.scrolledToBottom) {
				this.$nextTick(() => {
					el.scrollTop = el.scrollHeight;
				});
			}
		},
	},
};
</script>
