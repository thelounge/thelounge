<template>
	<div
		class="messages"
		role="log"
		aria-live="polite"
		aria-relevant="additions"
		@copy="onCopy"
	>
		<template v-for="(message, id) in getCondensedMessages">
			<div
				v-if="shouldDisplayDateMarker(id)"
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
				v-if="shouldDisplayUnreadMarker(message.id)"
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
				:key="message.id"/>
		</template>
	</div>
</template>

<script>
const constants = require("../js/constants");
const clipboard = require("../js/clipboard");
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
		getCondensedMessages() {
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
		shouldDisplayDateMarker(id) {
			const previousTime = this.channel.messages[id - 1];

			if (!previousTime) {
				return true;
			}

			const currentTime = this.channel.messages[id];

			return (new Date(previousTime.time)).getDay() !== (new Date(currentTime.time)).getDay();
		},
		shouldDisplayUnreadMarker(msgId) {
			return this.channel.firstUnread === msgId;
		},
		onCopy() {
			clipboard(this.$el);
		},
	},
};
</script>
