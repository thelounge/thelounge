<template>
	<span class="content">
		<Username :user="message.from" />
		<i class="hostmask"> (<ParsedMessage :network="network" :text="message.hostmask" />)</i>
		<template v-if="message.account">
			<i class="account"> [{{ message.account }}]</i>
		</template>
		<template v-if="message.gecos">
			<i class="realname"> {{ message.gecos }}</i>
		</template>
		has joined the channel
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeJoin",
	components: {
		ParsedMessage,
		Username,
	},
	props: {
		network: Object,
		message: Object,
	},
};
</script>
