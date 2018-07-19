<template>
	<span class="content">
		<ParsedMessage
			v-if="message.self"
			:network="network"
			:message="message"/>
		<template v-else>
			<Username :user="message.from"/>
			is back
		</template>
	</span>
</template>

<script>
import ParsedMessage from "../ParsedMessage.vue";
import Username from "../Username.vue";

export default {
	name: "MessageTypeBack",
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
