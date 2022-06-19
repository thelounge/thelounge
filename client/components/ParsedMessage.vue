<script lang="ts">
import {defineComponent, PropType, h} from "vue";
import parse from "../js/helpers/parse";
import type {ClientMessage, ClientNetwork} from "../js/types";

export default defineComponent({
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: {type: Object as PropType<ClientMessage | string>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: false},
	},
	render(context) {
		return parse(
			typeof context.text !== "undefined" ? context.text : context.message.text,
			context.message,
			context.network
		);
	},
});
</script>
