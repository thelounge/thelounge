<template>
	<span class="content">
		<Username :user="message.from"/>
		<span
			ref="text"
			class="text"><ParsedMessage :message="message"/></span>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeAction",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
