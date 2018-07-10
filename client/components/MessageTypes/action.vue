<template>
	<span class="content">
		<Username :user="message.from"/>
		<span
			class="text"
			v-html="$options.filters.parse(message.text, message.users)"/>
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
