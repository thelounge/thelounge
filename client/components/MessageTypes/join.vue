<template>
	<span class="content">
		<Username :user="message.from"/>
		<i class="hostmask">({{ message.hostmask }})</i>
		has joined the channel
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeJoin",
	components: {
		Username,
	},
	props: {
		message: Object,
	},
};
</script>
