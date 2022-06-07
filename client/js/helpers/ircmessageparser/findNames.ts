import {Part} from "./merge";

const nickRegExp = /([\w[\]\\`^{|}-]+)/g;

export type NamePart = Part & {
	nick: string;
};

function findNames(text: string, nicks: string[]): NamePart[] {
	const result: NamePart[] = [];

	// Return early if we don't have any nicknames to find
	if (nicks.length === 0) {
		return result;
	}

	let match: RegExpExecArray | null;

	while ((match = nickRegExp.exec(text))) {
		if (nicks.indexOf(match[1]) > -1) {
			result.push({
				start: match.index,
				end: match.index + match[1].length,
				nick: match[1],
			});
		}
	}

	return result;
}

export default findNames;
