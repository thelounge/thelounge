"use strict";

const emojiRegExp = require("emoji-regex")();

function findEmoji(text) {
	const result = [];
	let match;

	while ((match = emojiRegExp.exec(text))) {
		result.push({
			start: match.index,
			end: match.index + match[0].length,
			emoji: match[0],
		});
	}

	return result;
}

module.exports = findEmoji;
