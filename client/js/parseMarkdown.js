const markdown = require("simple-markdown");

const rules = {
	Array: Object.assign({}, markdown.defaultRules.Array, {
		irc(arr, output, state) {
			let result = "";

			// map output over the ast, except group any text
			// nodes together into a single string output.
			for (let i = 0; i < arr.length; i++) {
				let node = arr[i];

				if (node.type === "text") {
					node = {type: "text", content: node.content};

					for (; i + 1 < arr.length && arr[i + 1].type === "text"; i++) {
						node.content += arr[i + 1].content;
					}
				}

				result += output(node, state);
			}

			return result;
		},
	}),
	newline: Object.assign({}, markdown.defaultRules.newline, {
		irc() {
			return "\n";
		},
	}),
	escape: markdown.defaultRules.escape,
	em: Object.assign({}, markdown.defaultRules.em, {
		irc(node, output, state) {
			return `\x1D${output(node.content, state)}\x1D`;
		},
	}),
	strong: Object.assign({}, markdown.defaultRules.strong, {
		irc(node, output, state) {
			return `\x02${output(node.content, state)}\x02`;
		},
	}),
	u: Object.assign({}, markdown.defaultRules.u, {
		irc(node, output, state) {
			return `\x1F${output(node.content, state)}\x1F`;
		},
	}),
	strike: Object.assign({}, markdown.defaultRules.del, {
		match: markdown.inlineRegex(/^~~([\s\S]+?)~~(?!_)/),
		irc(node, output, state) {
			return `\x1E${output(node.content, state)}\x1E`;
		},
	}),
	inlineCode: Object.assign({}, markdown.defaultRules.inlineCode, {
		irc(node) {
			return `\x11${node.content}\x11`;
		},
	}),
	text: Object.assign({}, markdown.defaultRules.text, {
		irc(node) {
			return node.content;
		},
	}),
	emoticon: {
		order: markdown.defaultRules.text.order,
		match: (source) => /^(¯\\_\(ツ\)_\/¯)/.exec(source),
		parse(capture) {
			return {
				type: "text",
				content: capture[1],
			};
		},
		irc(node, output, state) {
			return output(node.content, state);
		},
	},
	spoiler: {
		order: 0,
		match: (source) => /^\|\|([\s\S]+?)\|\|/.exec(source),
		parse(capture, parse, state) {
			return {
				content: parse(capture[1], state),
			};
		},
		irc(node, output, state) {
			return `\x0301,01${output(node.content, state)}\x0399,99`;
		},
	},
};

const parser = markdown.parserFor(rules);

const ircOutput = markdown.outputFor(rules, "irc");

function parseMarkdown(input) {
	const state = {inline: true};
	return ircOutput(parser(input, state), state);
}

module.exports = parseMarkdown;
