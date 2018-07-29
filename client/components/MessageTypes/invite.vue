<template>
	<span class="content">
		<Username :user="message.from" />
		invited
		<span v-if="message.invitedYou">you</span>
		<Username
			v-else
			:user="message.target" />
		to <ParsedMessage
			:network="network"
			:text="message.channel" />
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeInvite",
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
