"use strict";

const anyIntersection = require("./anyIntersection");
const fill = require("./fill");

let Object_assign = Object.assign;

if (typeof Object_assign !== "function") {
	Object_assign = function(target) {
		Array.prototype.slice.call(arguments, 1).forEach(function(obj) {
			Object.keys(obj).forEach(function(key) {
				target[key] = obj[key];
			});
		});
		return target;
	};
}

// Merge text part information within a styling fragment
function assign(textPart, fragment) {
	const fragStart = fragment.start;
	const start = Math.max(fragment.start, textPart.start);
	const end = Math.min(fragment.end, textPart.end);

	return Object_assign({}, fragment, {
		start: start,
		end: end,
		text: fragment.text.slice(start - fragStart, end - fragStart)
	});
}

// Merge the style fragments withing the text parts, taking into account
// boundaries and text sections that have not matched to links or channels.
// For example, given a string "foobar" where "foo" and "bar" have been
// identified as parts (channels, links, etc.) and "fo", "ob" and "ar" have 3
// different styles, the first resulting part will contain fragments "fo" and
// "o", and the second resulting part will contain "b" and "ar". "o" and "b"
// fragments will contain duplicate styling attributes.
function merge(textParts, styleFragments) {
	// Re-build the overall text (without control codes) from the style fragments
	const cleanText = styleFragments.reduce((acc, frag) => acc + frag.text, "");

	// Every section of the original text that has not been captured in a "part"
	// is filled with "text" parts, dummy objects with start/end but no extra
	// metadata.
	const allParts = textParts
		.concat(fill(textParts, cleanText))
		.sort((a, b) => a.start - b.start);

	// Distribute the style fragments within the text parts
	return allParts.map((textPart) => {
		textPart.fragments = styleFragments
			.filter((fragment) => anyIntersection(textPart, fragment))
			.map((fragment) => assign(textPart, fragment));

		return textPart;
	});
}

module.exports = merge;
