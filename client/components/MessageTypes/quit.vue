<template>
	<span class="content">
		<Username :user="message.from" />
		<i class="hostmask">({{ message.hostmask }})</i>
		has quit
		<i
			v-if="message.text"
			class="quit-reason">(<ParsedMessage
				:network="network"
				:message="message" />)</i>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeQuit",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		network: Object,
		message: Object,
	},
};
</script>
