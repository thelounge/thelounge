<template>
	<span class="content">
		<template v-if="message.from && message.from.nick">
			<Username :user="message.from" />
			has changed the topic to:
		</template>
		<template v-else>
			The topic is:
		</template>
		<span
			v-if="message.text"
			class="new-topic"><ParsedMessage
				:network="network"
				:message="message" /></span>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeTopic",
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
