import {VNode, RendererNode, RendererElement, h} from "vue";

const MD_PLACEHOLDER_TAG = "thelounge-mdparse-placeholder";
const MD_PLACEHOLDER_OPEN = `<${MD_PLACEHOLDER_TAG}>`;
const MD_PLACEHOLDER_CLOSE = `</${MD_PLACEHOLDER_TAG}>`;

export const createPlaceholder = (idx: number | string) =>
	`${MD_PLACEHOLDER_OPEN}${idx}${MD_PLACEHOLDER_CLOSE}`;

export type ParseFragment =
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

const parseMd = (src: string, renderMdSrc) => {
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

			const srcBlock = renderMdSrc ? (double ? c + c : c) : "";
			const spanContents = `${srcBlock}${parseMd(
				src.slice(i + n, end),
				renderMdSrc
			)}${srcBlock}`;

			if (end !== -1) {
				result.push(`<span class='irc-${className}'>${spanContents}</span>`);
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
			if (src[i] === "<") {
				if (src.slice(i, i + MD_PLACEHOLDER_OPEN.length) === MD_PLACEHOLDER_OPEN) {
					let j = -1;

					if ((j = src.indexOf(MD_PLACEHOLDER_CLOSE, i)) !== -1) {
						const idx = src.slice(i + MD_PLACEHOLDER_OPEN.length, j);
						let placeholder = createPlaceholder(idx);

						i += placeholder.length - 1;
						const NUMERIC_TEST = /^\d(\.\d+)?$/;

						if (!idx.match(NUMERIC_TEST)) {
							placeholder = placeholder
								.replaceAll("<", "&lt;")
								.replaceAll(">", "&gt;");
						}

						result.push(placeholder);
					} else {
						result.push("&lt;");
					}
				} else {
					result.push("&lt;");
				}
			} else {
				result.push(src[i]);
			}
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

function mapDOM(element: HTMLElement | string): DomElementRepr {
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

		element = docNode.querySelector("body")!;
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

		if (!content) {
			return [];
		}

		for (const item of content) {
			if (typeof item === "string") {
				children.push(item);
			} else if (item?.type) {
				if (item.type.toLowerCase() === MD_PLACEHOLDER_TAG) {
					if (!item?.content) {
						continue;
					}

					const elt = htmls.get(parseFloat(item.content[0] as string));

					if (!elt) {
						children.push(createPlaceholder(item.content[0] as string));
					} else {
						children.push(elt);
					}
				} else {
					children.push(
						h(
							item.type,
							{...item.attributes},
							...(item?.content ? item.content.map((elt) => [elt]).map(create) : [])
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

const idGenerator = () => {
	const ids = new Set();

	const genId = () => {
		let id = Math.random();

		while (ids.has(id)) {
			id = Math.random();
		}

		return id;
	};

	return genId;
};

export const parseMarkdownMessage = (
	message: (
		| VNode<RendererNode, RendererElement, {[key: string]: any}>
		| (string | VNode<RendererNode, RendererElement, {[key: string]: any}> | undefined)[]
	)[],
	renderMdSrc: boolean
): ParseFragment[] => {
	const htmls: Map<number, ParseFragment> = new Map();
	const id = idGenerator();

	const generateStandIns = (nodes): string[] => {
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

	const toParse = "".concat(...generateStandIns(message));
	return rehydrate(parseMd(toParse, renderMdSrc), htmls);
};
