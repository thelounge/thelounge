<template>
	<div>
		<ParsedMessage :text="text" :message="message" :network="network" />
	</div>
</template>

<script lang="ts">
import ParsedMessage from "../../../client/components/ParsedMessage.vue";
import {defineComponent, PropType} from "vue";
import {ClientMessage, ClientNetwork} from "../../../client/js/types";

export default defineComponent({
	name: "ParsedMessageTestWrapper",
	components: {
		ParsedMessage,
	},
	props: {
		text: String,
		message: {type: Object as PropType<ClientMessage>},
		network: {type: Object as PropType<ClientNetwork>, required: true},
	},
});
</script>
