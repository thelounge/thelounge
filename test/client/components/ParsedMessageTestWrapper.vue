z
<template>
	<div>
		<ParsedMessage :text="text" :message="message" :network="network" />
	</div>
</template>

<script lang="ts">
import ParsedMessage from "../../../client/components/ParsedMessage.vue";

export default defineComponent({
	name: "ParsedMessageTestWrapper",
	components: {
		ParsedMessage,
	},
	props: {
		text: String,
		message: Object,
		network: {type: Object as PropType<ClientNetwork>, required: true},
	},
});
</script>
