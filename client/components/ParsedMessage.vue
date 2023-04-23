<script lang="ts">
import {defineComponent, PropType} from "vue";
import parse from "../js/helpers/parse";
import {
	ParseFragment,
	createPlaceholder,
	rehydrate,
	parseMd,
	idGenerator,
} from "../js/helpers/mdHelpers";
import type {ClientMessage, ClientNetwork} from "../js/types";
import {useStore} from "../js/store";

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
			const htmls: Map<number, ParseFragment> = new Map();
			const id = idGenerator();

			const generateStandIns = (nodes) => {
				const result: string[] = [];

				for (let i = 0; i < nodes.length; i++) {
					if (nodes[i] instanceof Array) {
						result.push(...generateStandIns(nodes[i]));
					} else {
						if (typeof nodes[i] === "string") {
							result.push(nodes[i]);
						} else {
							const nextId = id();

							htmls.set(nextId, nodes[i]);
							result.push(createPlaceholder(nextId));
						}
					}
				}

				return result;
			};

			const toParse = "".concat(...generateStandIns(parsed));
			return rehydrate(parseMd(toParse), htmls);
		}

		return parsed;
	},
});
</script>
