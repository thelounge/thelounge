<template>
	<span class="content">
		<Username :user="message.from" />
		is now known as
		<Username :user="{nick: message.new_nick, mode: message.from.mode}" />
	</span>
</template>

<script>
import Username from "../Username.vue";

export default {
	name: "MessageTypeNick",
	components: {
		Username,
	},
	props: {
		network: Object,
		message: Object,
	},
};
</script>
