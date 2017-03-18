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

function merge(textParts, styleFragments) {
	const cleanText = styleFragments.map(fragment => fragment.text).join("");

	const allParts = textParts
		.concat(fill(textParts, cleanText))
		.sort((a, b) => a.start - b.start);

	return allParts.map(textPart => {
		textPart.fragments = styleFragments
			.filter(fragment => anyIntersection(textPart, fragment))
			.map(fragment => assign(textPart, fragment));

		return textPart;
	});
}

module.exports = merge;
