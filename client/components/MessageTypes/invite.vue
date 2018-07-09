<template v-elseif="message.type === 'message'">
	<span class="content">
		<Username :user="message.from"/>
		invited
		<span v-if="message.invitedYou">you</span>
		<Username
			v-else
			:user="message.target"/>
		to <span v-html="$options.filters.parse(message.channel)"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeInvite",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
