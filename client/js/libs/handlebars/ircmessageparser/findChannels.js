"use strict";

const escapeRegExp = require("lodash/escapeRegExp");

// NOTE: channel prefixes should be RPL_ISUPPORT.CHANTYPES
// NOTE: userModes should be RPL_ISUPPORT.PREFIX
function findChannels(text, channelPrefixes, userModes) {
	const userModePattern = userModes.map(escapeRegExp).join("");
	const channelPrefixPattern = channelPrefixes.map(escapeRegExp).join("");

	const channelPattern = `(?:^|\\s)[${ userModePattern }]*([${ channelPrefixPattern }][^ \u0007]+)`;
	const channelRegExp = new RegExp(channelPattern, "g");

	const result = [];
	let match;

	do {
		match = channelRegExp.exec(text);

		if (match) {
			result.push({
				start: match.index + match[0].length - match[1].length,
				end: match.index + match[0].length,
				channel: match[1]
			});
		}
	} while (match);

	return result;
}

module.exports = findChannels;
