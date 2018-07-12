<template>
	<span class="content">
		<Username :user="message.from"/>
		has kicked
		<Username :user="message.target"/>
		<i
			v-if="message.text"
			class="part-reason">(<ParsedMessage :message="message"/>)</i>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeKick",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
