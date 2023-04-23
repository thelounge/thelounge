<script lang="ts">
import {defineComponent, PropType, h, VNode, RendererNode, RendererElement} from "vue";
import parse from "../js/helpers/parse";
import type {ClientMessage, ClientNetwork} from "../js/types";
import {useStore} from "../js/store";

type ParseFragment =
	| string
	| VNode<
			RendererNode,
			RendererElement,
			{
				[key: string]: any;
			}
	  >
	| (
			| string
			| VNode<
					RendererNode,
					RendererElement,
					{
						[key: string]: any;
					}
			  >
			| undefined
	  )[];

const parseMd = (src: string) => {
	let i = 0;
	const result: string[] = [];

	const checkChar = (c: "~" | "*" | "_" | "`", double: boolean) => {
		const n = double ? 2 : 1;

		if (src[i] === c && (double ? src[i + 1] === c : true)) {
			const end = src.indexOf(c.repeat(n), i + n);
			const className = {
				"~": "strikethrough",
				"*": double ? "bold" : "italic",
				_: double ? "bold" : "italic",
				"`": "monospace",
			}[c];

			if (end !== -1) {
				result.push(
					`<span class='irc-${className}'>${parseMd(src.slice(i + n, end))}</span>`
				);
				i = end + n;
			}
		}
	};

	while (i < src.length) {
		checkChar("*", true);
		checkChar("*", false);
		checkChar("_", true);
		checkChar("_", false);
		checkChar("~", true);
		checkChar("`", false);

		if (src[i]) {
			result.push(src[i]);
		}

		i++;
	}

	return "".concat(...result);
};

type DomElementRepr = {
	content: (DomElementRepr | string)[];
	type?: string;
	attributes?: Record<string, string>;
};

function mapDOM(element): DomElementRepr {
	const treeObject: any = {};
	let docNode: Document | null = null;

	// If string convert to document Node
	if (typeof element === "string") {
		if (window.DOMParser) {
			const parser = new DOMParser();
			docNode = parser.parseFromString(element, "text/html");
		}

		if (!docNode) {
			throw new Error("Error parsing XML");
		}

		element = docNode.querySelector("body");
	}

	// Recursively loop through DOM elements and assign properties to object
	function treeHTML(elt: any, object: any) {
		object.type = elt.nodeName;
		const nodeList = elt.childNodes;

		if (nodeList !== null) {
			if (nodeList.length) {
				object.content = [];

				for (let i = 0; i < nodeList.length; i++) {
					if (nodeList[i].nodeType === 3) {
						object.content.push(nodeList[i].nodeValue);
					} else {
						object.content.push({});
						treeHTML(nodeList[i], object.content[object.content.length - 1]);
					}
				}
			}
		}

		if (elt?.attributes) {
			if (elt.attributes.length) {
				object.attributes = {};

				for (let i = 0; i < elt.attributes.length; i++) {
					object.attributes[elt.attributes[i].nodeName] = elt.attributes[i].nodeValue;
				}
			}
		}
	}

	treeHTML(element, treeObject);

	return treeObject as DomElementRepr;
}

const rehydrate = (parsed: string, htmls: Map<number, ParseFragment>) => {
	const parsedDom = mapDOM(parsed);
	const result: (ParseFragment | string)[] = [];

	const create = (content: typeof parsedDom.content) => {
		const children: typeof result = [];

		for (const item of content) {
			if (typeof item === "string") {
				children.push(item);
			} else if (item?.type) {
				if (item.type.toLowerCase() === "thelounge-mdparse-placeholder") {
					const elt = htmls.get(parseInt(item.content[0] as string)) as ParseFragment;
					children.push(elt);
				} else {
					children.push(
						h(
							item.type,
							{...item.attributes},
							...item.content.map((elt) => [elt]).map(create)
						)
					);
				}
			}
		}

		return children;
	};

	result.push(...create(parsedDom.content));

	return result;
};

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
			const standIns: string[] = [];
			let standInCount = 0;

			const generateStandIns = (nodes) => {
				const result: string[] = [];

				for (let i = 0; i < nodes.length; i++) {
					if (nodes[i] instanceof Array) {
						result.push(...generateStandIns(nodes[i]));
					} else {
						if (typeof nodes[i] === "string") {
							result.push(nodes[i]);
						} else {
							htmls.set(standInCount, nodes[i]);
							result.push(
								`<thelounge-mdparse-placeholder>${standInCount++}</thelounge-mdparse-placeholder>`
							);
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
