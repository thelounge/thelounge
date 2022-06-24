// Escapes the RegExp special characters "^", "$", "", ".", "*", "+", "?", "(",
// ")", "[", "]", "{", "}", and "|" in string.
// See https://lodash.com/docs/#escapeRegExp
import escapeRegExp from "lodash/escapeRegExp";
import {Part} from "./merge";

export type ChannelPart = Part & {
	channel: string;
};

// escapes a regex in a way that's compatible to shove it in
// a regex char set (meaning it also escapes -)
function escapeRegExpCharSet(raw: string): string {
	const escaped: string = escapeRegExp(raw);
	return escaped.replace("-", "\\-");
}

// Given an array of channel prefixes (such as "#" and "&") and an array of user
// modes (such as "@" and "+"), this function extracts channels and nicks from a
// text.
// It returns an array of objects for each channel found with their start index,
// end index and channel name.
function findChannels(text: string, channelPrefixes: string[], userModes: string[]) {
	// `userModePattern` is necessary to ignore user modes in /whois responses.
	// For example, a voiced user in #thelounge will have a /whois response of:
	// > foo is on the following channels: +#thelounge
	// We need to explicitly ignore user modes to parse such channels correctly.
	const userModePattern = userModes.map(escapeRegExpCharSet).join("");
	const channelPrefixPattern = channelPrefixes.map(escapeRegExpCharSet).join("");
	const channelPattern = `(?:^|\\s)[${userModePattern}]*([${channelPrefixPattern}][^ \u0007]+)`;
	const channelRegExp = new RegExp(channelPattern, "g");

	const result: ChannelPart[] = [];
	let match: RegExpExecArray | null;

	do {
		// With global ("g") regexes, calling `exec` multiple times will find
		// successive matches in the same string.
		match = channelRegExp.exec(text);

		if (match) {
			result.push({
				start: match.index + match[0].length - match[1].length,
				end: match.index + match[0].length,
				channel: match[1],
			});
		}
	} while (match);

	return result;
}

export default findChannels;
