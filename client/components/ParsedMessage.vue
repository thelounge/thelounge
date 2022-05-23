<script lang="ts">
import {defineComponent, PropType, h} from "vue";
import parse from "../js/helpers/parse";
import type {ClientMessage, ClientNetwork} from "../js/types";

export default defineComponent({
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: {type: Object as PropType<ClientMessage>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: false},
	},
	setup(props) {
		const render = () => {
			return parse(
				typeof props.text !== "undefined" ? props.text : props.message!.text,
				props.message,
				props.network
			);
		};

		return {
			render,
		};
	},
});
</script>
