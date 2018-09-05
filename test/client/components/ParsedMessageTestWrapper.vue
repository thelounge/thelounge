<template>
	<div>
		<ParsedMessage
			:text="text"
			:message="message"
			:network="network" />
	</div>
</template>

<script>
import ParsedMessage from "../../../client/components/ParsedMessage.vue";

export default {
	name: "ParsedMessageTestWrapper",
	components: {
		ParsedMessage,
	},
	props: {
		text: String,
		message: Object,
		network: Object,
	},
};
</script>
