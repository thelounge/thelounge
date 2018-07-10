<template>
	<span class="content">
		<Username :user="message.from"/>
		<i class="hostmask">({{ message.hostmask }})</i>
		has quit
		<i
			v-if="message.text"
			class="quit-reason"
			v-html="'(' + $options.filters.parse(message.text) + ')'"/>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeQuit",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
