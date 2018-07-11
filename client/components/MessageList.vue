<template>
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
				@linkPreviewToggle="onLinkPreviewToggle"
				:key="message.id"/>
		</template>
	</div>
</template>

<script>
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
	},
};
</script>
