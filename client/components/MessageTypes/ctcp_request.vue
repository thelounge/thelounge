<template v-elseif="message.type === 'message'">
	<span class="content">
		<Username :user="message.from"/>
		sent a <abbr title="Client-to-client protocol">CTCP</abbr> request:
		<span
			class="ctcp-message"
			v-html="$options.filters.parse(message.ctcpMessage)"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeRequestCTCP",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
