<script lang="ts">
import {defineComponent, PropType} from "vue";
import parse from "../js/helpers/parse";
import type {ClientMessage, ClientNetwork} from "../js/types";
import {useStore} from "../js/store";
import {parseMarkdownMessage} from "../js/helpers/mdHelpers";

export default defineComponent({
	name: "ParsedMessage",
	functional: true,
	props: {
		text: String,
		message: {type: Object as PropType<ClientMessage | string>, required: false},
		network: {type: Object as PropType<ClientNetwork>, required: false},
	},
	setup() {
		const store = useStore();

		return {
			store,
		};
	},
	render(context) {
		const parsed = parse(
			typeof context.text !== "undefined" ? context.text : context.message.text,
			context.message,
			context.network
		);

		if (context?.message?.type === "message" && this.store.state.settings.parseMd) {
			return parseMarkdownMessage(parsed, this.store.state.settings.renderMdSrc);
		}

		return parsed;
	},
});
</script>
