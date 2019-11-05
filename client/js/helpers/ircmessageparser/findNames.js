"use strict";

const nickRegExp = /([\w[\]\\`^{|}-]+)/g;

function findNames(text, users) {
	const result = [];

	// Return early if we don't have any nicknames to find
	if (users.length === 0) {
		return result;
	}

	let match;

	while ((match = nickRegExp.exec(text))) {
		if (users.indexOf(match[1]) > -1) {
			result.push({
				start: match.index,
				end: match.index + match[1].length,
				nick: match[1],
			});
		}
	}

	return result;
}

module.exports = findNames;
