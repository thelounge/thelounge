<template>
	<span class="content">
		<Username :user="message.from"/>
		<span class="ctcp-message"><ParsedMessage :text="message.ctcpMessage"/></span>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeCTCP",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
