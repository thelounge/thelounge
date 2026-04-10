import {Part} from "./merge";

const nickRegExp = /([\w[\]\\`^{|}-]+)/g;

// Intl.Segmenter prevents false nick matches inside words with apostrophes (e.g. "it's")
// or non-ASCII characters
// h/t John: https://github.com/thelounge/thelounge/issues/2008#issuecomment-1045417049
const segmenter = new Intl.Segmenter(undefined, {granularity: "word"});

export type NamePart = Part & {
	nick: string;
};

function findNames(text: string, nicks: string[]): NamePart[] {
	const result: NamePart[] = [];

	// Return early if we don't have any nicknames to find
	if (nicks.length === 0) {
		return result;
	}

	const nickSet = new Set(nicks);

	const wordSegments: Array<{start: number; end: number}> = [];

	for (const segment of segmenter.segment(text)) {
		if (segment.isWordLike) {
			wordSegments.push({
				start: segment.index,
				end: segment.index + segment.segment.length,
			});
		}
	}

	let match: RegExpExecArray | null;

	while ((match = nickRegExp.exec(text))) {
		if (nickSet.has(match[1])) {
			const matchStart = match.index;
			const matchEnd = match.index + match[1].length;

			// Ensure the match doesn't start or end in the interior of a word-like segment.
			// This prevents "S" from matching inside "it's" (segmented as one word),
			// while still allowing "xPaw" to match as a standalone word.
			let valid = true;

			for (const seg of wordSegments) {
				if (seg.start > matchEnd) {
					break;
				}

				if (
					(seg.start < matchStart && matchStart < seg.end) ||
					(seg.start < matchEnd && matchEnd < seg.end)
				) {
					valid = false;
					break;
				}
			}

			if (valid) {
				result.push({
					start: matchStart,
					end: matchEnd,
					nick: match[1],
				});
			}
		}
	}

	return result;
}

export default findNames;
