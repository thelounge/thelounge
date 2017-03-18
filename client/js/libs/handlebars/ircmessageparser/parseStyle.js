"use strict";

const BOLD = "\x02";
const COLOR = "\x03";
const RESET = "\x0f";
const REVERSE = "\x16";
const ITALIC = "\x1d";
const UNDERLINE = "\x1f";

const colorRx = /^(\d{1,2})(?:,(\d{1,2}))?/;
const controlCodesRx = /[\u0000-\u001F]/g;

function parseStyle(text) {
	const result = [];
	let start = 0;
	let position = 0;

	let colorCodes, bold, textColor, bgColor, reverse, italic, underline;

	const resetStyle = () => {
		bold = false;
		textColor = undefined;
		bgColor = undefined;
		reverse = false;
		italic = false;
		underline = false;
	};
	resetStyle();

	const emitFragment = () => {
		const textPart = text.slice(start, position);
		start = position + 1;

		const processedText = textPart.replace(controlCodesRx, "");

		if (!processedText.length) {
			return;
		}

		result.push({
			bold,
			textColor,
			bgColor,
			reverse,
			italic,
			underline,
			text: processedText
		});
	};

	while (position < text.length) {
		switch (text[position]) {

		case RESET:
			emitFragment();
			resetStyle();
			break;

		case BOLD:
			emitFragment();
			bold = !bold;
			break;

		case COLOR:
			emitFragment();

			colorCodes = text.slice(position + 1).match(colorRx);

			if (colorCodes) {
				textColor = Number(colorCodes[1]);
				bgColor = Number(colorCodes[2]);
				if (Number.isNaN(bgColor)) {
					bgColor = undefined;
				}
				position += colorCodes[0].length;
			} else {
				textColor = undefined;
				bgColor = undefined;
			}
			start = position + 1;
			break;

		case REVERSE:
			emitFragment();
			reverse = !reverse;
			break;

		case ITALIC:
			emitFragment();
			italic = !italic;
			break;

		case UNDERLINE:
			emitFragment();
			underline = !underline;
			break;
		}
		position += 1;
	}

	emitFragment();

	return result;
}

const properties = ["bold", "textColor", "bgColor", "italic", "underline", "reverse"];

function prepare(text) {
	return parseStyle(text)
		.filter(fragment => fragment.text.length)
		.reduce((prev, curr, i) => {
			if (i === 0) {
				return prev.concat([curr]);
			}

			const lastEntry = prev[prev.length - 1];
			if (properties.some(key => curr[key] !== lastEntry[key])) {
				return prev.concat([curr]);
			}

			lastEntry.text += curr.text;
			return prev;
		}, [])
		.map((fragment, i, array) => {
			fragment.start = i === 0 ? 0 : array[i - 1].end;
			fragment.end = fragment.start + fragment.text.length;
			return fragment;
		});
}

module.exports = prepare;
