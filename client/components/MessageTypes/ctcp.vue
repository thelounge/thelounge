<template>
	<span class="content">
		<Username :user="message.from"/>
		<span
			class="ctcp-message"
			v-html="$options.filters.parse(message.ctcpMessage)"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeCTCP",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
