"use strict";

// Styling control codes
const BOLD = "\x02";
const COLOR = "\x03";
const HEX_COLOR = "\x04";
const RESET = "\x0f";
const REVERSE = "\x16";
const ITALIC = "\x1d";
const UNDERLINE = "\x1f";

// Color code matcher, with format `XX,YY` where both `XX` and `YY` are
// integers, `XX` is the text color and `YY` is an optional background color.
const colorRx = /^(\d{1,2})(?:,(\d{1,2}))?/;

// 6-char Hex color code matcher
const hexColorRx = /^([0-9a-f]{6})(?:,([0-9a-f]{6}))?/i;

// Represents all other control codes that to be ignored/filtered from the text
const controlCodesRx = /[\u0000-\u001F]/g;

// Converts a given text into an array of objects, each of them representing a
// similarly styled section of the text. Each object carries the `text`, style
// information (`bold`, `textColor`, `bgcolor`, `reverse`, `italic`,
// `underline`), and `start`/`end` cursors.
function parseStyle(text) {
	const result = [];
	let start = 0;
	let position = 0;

	// At any given time, these carry style information since last time a styling
	// control code was met.
	let colorCodes, bold, textColor, bgColor, hexColor, hexBgColor, reverse, italic, underline;

	const resetStyle = () => {
		bold = false;
		textColor = undefined;
		bgColor = undefined;
		hexColor = undefined;
		hexBgColor = undefined;
		reverse = false;
		italic = false;
		underline = false;
	};
	resetStyle();

	// When called, this "closes" the current fragment by adding an entry to the
	// `result` array using the styling information set last time a control code
	// was met.
	const emitFragment = () => {
		// Uses the text fragment starting from the last control code position up to
		// the current position
		const textPart = text.slice(start, position);

		// Filters out all non-style related control codes present in this text
		const processedText = textPart.replace(controlCodesRx, "");

		if (processedText.length) {
			// Current fragment starts where the previous one ends, or at 0 if none
			const fragmentStart = result.length ? result[result.length - 1].end : 0;

			result.push({
				bold,
				textColor,
				bgColor,
				hexColor,
				hexBgColor,
				reverse,
				italic,
				underline,
				text: processedText,
				start: fragmentStart,
				end: fragmentStart + processedText.length
			});
		}

		// Now that a fragment has been "closed", the next one will start after that
		start = position + 1;
	};

	// This loop goes through each character of the given text one by one by
	// bumping the `position` cursor. Every time a new special "styling" character
	// is met, an object gets created (with `emitFragment()`)information on text
	// encountered since the previous styling character.
	while (position < text.length) {
		switch (text[position]) {
		case RESET:
			emitFragment();
			resetStyle();
			break;

		// Meeting a BOLD character means that the ongoing text is either going to
		// be in bold or that the previous one was in bold and the following one
		// must be reset.
		// This same behavior applies to COLOR, REVERSE, ITALIC, and UNDERLINE.
		case BOLD:
			emitFragment();
			bold = !bold;
			break;

		case COLOR:
			emitFragment();

			// Go one step further to find the corresponding color
			colorCodes = text.slice(position + 1).match(colorRx);

			if (colorCodes) {
				textColor = Number(colorCodes[1]);
				if (colorCodes[2]) {
					bgColor = Number(colorCodes[2]);
				}
				// Color code length is > 1, so bump the current position cursor by as
				// much (and reset the start cursor for the current text block as well)
				position += colorCodes[0].length;
				start = position + 1;
			} else {
				// If no color codes were found, toggles back to no colors (like BOLD).
				textColor = undefined;
				bgColor = undefined;
			}
			break;

		case HEX_COLOR:
			emitFragment();

			colorCodes = text.slice(position + 1).match(hexColorRx);

			if (colorCodes) {
				hexColor = colorCodes[1].toUpperCase();
				if (colorCodes[2]) {
					hexBgColor = colorCodes[2].toUpperCase();
				}
				// Color code length is > 1, so bump the current position cursor by as
				// much (and reset the start cursor for the current text block as well)
				position += colorCodes[0].length;
				start = position + 1;
			} else {
				// If no color codes were found, toggles back to no colors (like BOLD).
				hexColor = undefined;
				hexBgColor = undefined;
			}

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

		// Evaluate the next character at the next iteration
		position += 1;
	}

	// The entire text has been parsed, so we finalize the current text fragment.
	emitFragment();

	return result;
}

const properties = ["bold", "textColor", "bgColor", "hexColor", "hexBgColor", "italic", "underline", "reverse"];

function prepare(text) {
	return parseStyle(text)
		// This optimizes fragments by combining them together when all their values
		// for the properties defined above are equal.
		.reduce((prev, curr) => {
			if (prev.length) {
				const lastEntry = prev[prev.length - 1];
				if (properties.every((key) => curr[key] === lastEntry[key])) {
					lastEntry.text += curr.text;
					lastEntry.end += curr.text.length;
					return prev;
				}
			}
			return prev.concat([curr]);
		}, []);
}

module.exports = prepare;
