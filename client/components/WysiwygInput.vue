<template>
	<div id="input" ref="container" class="wysiwyg-container">
		<div ref="indicator" class="indicator"></div>
		<IrcColorPicker ref="colorpicker" />
		<div
			id="wysiwyg-input"
			ref="input"
			dir="auto"
			class="wysiwyg-input"
			contenteditable="true"
			:data-placeholder="placeholder"
			:aria-label="placeholder"
			@focus="onFocus"
			@blur="onBlur"
		></div>
	</div>
</template>

<style>
.wysiwyg-container {
	width: 100%;
	max-width: 100%;
	display: flex;

	overflow: hidden;
}
.wysiwyg-container .wysiwyg-input {
	width: 100%;
	height: 100%;
	cursor: text;
	background: inherit;
	outline: none;

	overflow: hidden;
	word-wrap: break-word;
}

/*.wysiwyg-container .wysiwyg-input:empty:not(:focus)::before {*/
.wysiwyg-container .wysiwyg-input:empty::before {
	/*
	Show a placeholder when the input is empty. Emptyness isn't guaranteed by
	contenteditable but we empty with JS when it has no text content
	*/
	display: block;
	content: attr(data-placeholder);
}

.wysiwyg-container .wysiwyg-input sub {
	font-size: inherit;
	font-family: monospace;
	position: static !important;
}

/* TODO: remove this */
.wysiwyg-container .indicator {
	display: inline-block;
	display: none;
	border: 1px solid black;
	position: fixed;
	z-index: 100;
}
</style>

<script>
import Mousetrap from "mousetrap";
import * as he from "he";
import IrcColorPicker from "./IrcColorPicker.vue";

import {
	getLinesAsFragments,
	cloneNodeTreeSelective,
	cleanWysiwygMarkup,
} from "../js/helpers/wysiwyg";

// Mapping of HTML tag names to IRC format control characters
const tagToControlCharacter = {
	b: "\x02",
	br: "\n",
	strong: "\x02",
	em: "\x02",
	u: "\x1F",
	strike: "\x1e",
	sub: "\x11",
	i: "\x1D",
};

// Autocomplete bracket and quote characters like in a modern IDE
// For example, select `text`, press `[` key, and it becomes `[text]`
const bracketWraps = {
	'"': '"',
	"'": "'",
	"(": ")",
	"<": ">",
	"[": "]",
	"{": "}",
	"*": "*",
	"`": "`",
	"~": "~",
	_: "_",
};

// Key bindings for formatting
const formattingHotkeys = {
	"mod+k": "color",
	"mod+b": "bold",
	"mod+u": "underline",
	"mod+o": "removeFormat",
	"mod+s": "strikeThrough",
	"mod+i": "italic",
	"mod+m": "monospace", // code tags not supported, we hack around it with subscript styled as monospace
};

// Convert a HTML string to IRC control character representation
function formatToControlCharacters(text) {
	// This is regex based so possibly fragile but we have control over
	// the formatting of the HTML and we sanitize it so it's workable
	// For colors this relies on the fact that we never allow nested
	const tagNames = Object.keys(tagToControlCharacter);

	// Wrap basic HTML formatting tags to IRC control codes
	for (const tagName of tagNames) {
		text = text.replace(new RegExp("</?" + tagName + ">", "g"), tagToControlCharacter[tagName]);
	}

	// Convert our color spans to IRC colors
	// First handle both colors
	text = text.replace(
		new RegExp('<span class="irc-fg(.*?) irc-bg(.*?)">(.*?)</span>', "g"),
		"\x03$1,$2$3\x03"
	);
	// Then foreground and background separately
	text = text.replace(new RegExp('<span class="irc-fg(.*?)">(.*?)</span>', "g"), "\x03$1$2\x03");
	text = text.replace(
		new RegExp('<span class="irc-bg(.*?)">(.*?)</span>', "g"),
		"\x0300,$1$2\x03"
	);

	return text;
}

function toIrcFormat(text) {
	return he.decode(formatToControlCharacters(text));
}

export default {
	name: "WysiwygInput",
	components: {
		IrcColorPicker,
	},
	props: {
		placeholder: String,
		autoHeight: {
			default: true,
			type: Boolean,
		},
	},
	data() {
		return {
			cleanPaste: true,
		};
	},
	mounted() {
		const inputTrap = Mousetrap(this.$refs.input);

		// this.autocomplete = new Autocomplete(); // TODO

		// Keep track of cursor pixel position
		this.$refs.input.addEventListener("input", (e) => {
			this.onInput(e);
		});

		// Submit
		inputTrap.bind("enter", this.onSubmit);

		// Newline
		inputTrap.bind("shift+enter", this.newLine);

		// Clean up pasted HTML
		this.$refs.input.addEventListener("paste", (e) => {
			if (this.cleanPaste) {
				e.preventDefault();
				const text = e.clipboardData.getData("text/plain");
				document.execCommand("insertText", false, text);
			}
		});

		this.$refs.input.addEventListener("keyup", () => {
			this.updateSelectionIndicator();
		});

		// Formatting
		inputTrap.bind(Object.keys(formattingHotkeys), (e, key) => {
			const command = formattingHotkeys[key];
			this.runCommand(command);
			return false;
		});

		// Bracket matching
		inputTrap.bind(Object.keys(bracketWraps), (e, key) => {
			if (this.surroundSelection(key, bracketWraps[key])) {
				return false;
			}
		});
	},
	destroyed() {},
	methods: {
		isEmpty() {
			return !this.$refs.input.textContent;
		},
		getHtmlContent() {
			// TODO: format & setter
			// TODO Move <br> removal to cleanup and do it dom based instead of string based
			let html = this.$refs.input.innerHTML;

			if (html.endsWith("<br>")) {
				// Remove the last trailing newline
				html = html.substring(0, html.length - 4);
			}

			return html;
		},
		setHtmlContent(html) {
			this.$refs.input.innerHTML = html;
		},
		getLines() {
			const sel = window.getSelection();
			const range = sel.getRangeAt(0);
			const fragments = getLinesAsFragments(this.$refs.input, range);
			const lines = fragments.map((f) => {
				const el = document.createElement("div");
				el.appendChild(f);
				return el.innerHTML;
			});
			return lines;
		},

		getIrcContent() {
			return toIrcFormat(this.getHtmlContent());
		},
		getIrcLines() {
			return this.getLines().map(toIrcFormat);
		},
		focus() {
			this.$refs.input.focus();
		},
		blur() {
			this.$refs.input.blur();
		},
		runCommand(command) {
			if (command === "color") {
				this.pickColor();
				return;
			}

			if (command === "monospace") {
				// Monospace doesn't exist so we hack around it with subscript
				command = "subscript";
			}

			document.execCommand(command, false);
		},

		// Events
		onFocus() {},
		onBlur() {
			if (this.isEmpty()) {
				this.clear();
			}
		},
		onSubmit(e) {
			// FIXME: Implement html content normalization

			cleanWysiwygMarkup(this.$refs.input);

			this.$emit("submit", e);

			const html = this.$refs.input.innerHTML;
			const ircFormat = toIrcFormat(html);

			document.getElementById("input").value = ircFormat;
		},
		onInput() {
			this.onChange();
		},
		onChange() {
			if (this.autoHeight) {
				this.setAutoHeight();
			}

			this.updateSelectionIndicator();
		},

		// Actions
		newLine() {
			const sel = window.getSelection();
			const range = sel.getRangeAt(0);
			const element = document.createElement("br");
			range.deleteContents();
			range.insertNode(element);
			range.setStartAfter(element);

			this.onChange();
			return false;
		},
		clear() {
			this.$refs.input.innerHTML = "";
			this.onChange();
		},
		surroundSelection(start, end) {
			const sel = window.getSelection();

			if (sel.type === "Range") {
				const range = sel.getRangeAt(0);
				const startNode = document.createTextNode(start);
				const endNode = document.createTextNode(end);

				range.insertNode(startNode);
				range.collapse(false);
				range.insertNode(endNode);
				range.setStartAfter(startNode);
				range.setEndBefore(endNode);

				this.onChange();
				return true;
			}

			return false;
		},
		setAutoHeight() {
			this.$nextTick(() => {
				// Start by resetting height before computing as scrollHeight does not
				// decrease when deleting characters
				if (!this.$refs.container) {
					return;
				}

				this.$refs.container.style.height = "";

				// Set the container height to the content height
				this.$refs.container.style.height = this.$refs.input.scrollHeight + "px";
			});
		},
		pickColor() {
			// TODO: This should be broken up into parts
			const sel = window.getSelection();

			// If there is no selection do nothing (sel.type is `Caret`)
			if (sel.type !== "Range") {
				return;
			}

			// Get the cursor positon
			const range = sel.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			const pos = {x: rect.left, y: rect.top - 5};

			// Open the color picker above the current selection
			this.$refs.colorpicker.open(pos, (colors) => {
				this.focus();

				// If the color picker was exited or no colors were chosen do nothing
				if (!colors || (colors.fg === null && colors.bg === null)) {
					return;
				}

				// Create the color wrapper element
				const span = document.createElement("span");

				// Set appropriate color classes
				if (colors.fg !== null) {
					span.classList.add("irc-fg" + colors.fg);
				}

				if (colors.bg !== null) {
					span.classList.add("irc-bg" + colors.bg);
				}

				// Get the currently selected nodes and remove them from the dom
				const currentSelection = range.extractContents();

				// Clone the selected tree, remove any spans but keep their content
				const newTree = cloneNodeTreeSelective(
					currentSelection,
					(el) => el.nodeName === "SPAN"
				);

				// Insert the nodes into the span
				for (const element of newTree.childNodes) {
					span.appendChild(element.cloneNode(true));
				}

				// Insert the color span into the container
				range.insertNode(span);

				// Split the dom at the boundaries of the selection to break any possible parent spans
				// This is done by removing and re-inserting the nodes before and after the selection

				// Extract and re-insert everything before the users selection
				range.setStart(this.$refs.input, 0);
				range.setEndBefore(span);
				range.insertNode(range.extractContents());

				// Extract and re-insert everything after the users selection
				range.selectNodeContents(this.$refs.input);
				range.setStartAfter(span);
				range.insertNode(range.extractContents());

				if (span.parentNode.nodeName === "SPAN") {
					// If still nested in a color tag, replace the parent with the current color
					span.parentNode.replaceWith(span);
				}

				// Recreate the original selection
				range.setStartAfter(span);
				range.setEndBefore(span);
			});
		},
		updateSelectionIndicator() {
			// TODO: this is only for debugging
			const sel = window.getSelection();
			const range = sel.getRangeAt(0);
			const rect = range.getBoundingClientRect();

			const indicator = this.$refs.indicator;

			indicator.style.top = rect.top + "px";
			indicator.style.left = rect.left + "px";
			indicator.style.width = rect.width + "px";
			indicator.style.height = rect.height + "px";

			return false;
		},
	},
};
</script>
