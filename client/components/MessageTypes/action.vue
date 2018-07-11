<template>
	<span class="content">
		<Username :user="message.from"/>
		<span
			ref="text"
			class="text"><ParsedMessage :message="message"/></span>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeAction",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
