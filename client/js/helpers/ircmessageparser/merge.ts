import anyIntersection from "./anyIntersection";
import fill from "./fill";
import {ChannelPart} from "./findChannels";
import {EmojiPart} from "./findEmoji";
import {NamePart} from "./findNames";

type TextPart = Part & {
	text: string;
};

type Fragment = TextPart;

// Merge text part information within a styling fragment
function assign(textPart: Part, fragment: Fragment) {
	const fragStart = fragment.start;
	const start = Math.max(fragment.start, textPart.start);
	const end = Math.min(fragment.end, textPart.end);
	const text = fragment.text.slice(start - fragStart, end - fragStart);

	return Object.assign({}, fragment, {start, end, text});
}

function sortParts(a: Part, b: Part) {
	return a.start - b.start || b.end - a.end;
}

export type Part = {
	start: number;
	end: number;
	fragments?: Fragment;
};

type MergedPart = TextPart | NamePart | EmojiPart | ChannelPart;

type MergedPartWithFragments = MergedPart & {fragments: Fragment[]};

// Merge the style fragments within the text parts, taking into account
// boundaries and text sections that have not matched to links or channels.
// For example, given a string "foobar" where "foo" and "bar" have been
// identified as parts (channels, links, etc.) and "fo", "ob" and "ar" have 3
// different styles, the first resulting part will contain fragments "fo" and
// "o", and the second resulting part will contain "b" and "ar". "o" and "b"
// fragments will contain duplicate styling attributes.
function merge(
	textParts: MergedPart[],
	styleFragments: Fragment[],
	cleanText: string
): MergedPart[] {
	// Remove overlapping parts
	textParts = textParts.sort(sortParts).reduce<MergedPart[]>((prev, curr) => {
		const intersection = prev.some((p) => anyIntersection(p, curr));

		if (intersection) {
			return prev;
		}

		return prev.concat([curr]);
	}, []);

	// Every section of the original text that has not been captured in a "part"
	// is filled with "text" parts, dummy objects with start/end but no extra
	// metadata.

	const filled = fill(textParts, cleanText) as TextPart[];
	const allParts: MergedPart[] = [...textParts, ...filled].sort(sortParts); // Sort all parts identified based on their position in the original text

	// Distribute the style fragments within the text parts
	return allParts.map((textPart) => {
		// TODO: remove any type casting.
		(textPart as any).fragments = styleFragments
			.filter((fragment) => anyIntersection(textPart, fragment))
			.map((fragment) => assign(textPart, fragment));

		return textPart;
	});
}

export default merge;
