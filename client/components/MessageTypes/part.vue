<template>
	<span class="content">
		<Username :user="message.from"/>
		<i class="hostmask">({{ message.hostmask }})</i>
		has left the channel
		<i
			v-if="message.text"
			class="part-reason">(<ParsedMessage
				:network="network"
				:message="message"/>)</i>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypePart",
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
