<template>
	<div
		class="messages"
		role="log"
		aria-live="polite"
		aria-relevant="additions"
	>
		<template v-for="(message, id) in channel.messages">
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
			<Message
				:message="message"
				:key="message.id"/>
		</template>
	</div>
</template>

<script>
import Message from "./Message.vue";

export default {
	name: "MessageList",
	components: {
		Message,
	},
	props: {
		channel: Object,
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
			if (this.channel.firstUnread < msgId) {
				return false;
			}

			this.channel.firstUnread = 0;

			return true;
		},
	},
};
</script>
