<template>
	<span class="content">
		<Username :user="message.from" />
		has changed
		<span v-if="message.new_ident">username to <b>{{ message.new_ident }}</b></span>
		<span v-if="message.new_host">hostname to <i class="hostmask">{{ message.new_host }}</i></span>
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeChangeHost",
	components: {
		Username,
	},
	props: {
		network: Object,
		message: Object,
	},
};
</script>
