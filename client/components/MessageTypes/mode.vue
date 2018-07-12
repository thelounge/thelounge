<template>
	<span class="content">
		<Username :user="message.from"/>
		sets mode
		<ParsedMessage :message="message"/>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeMode",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
