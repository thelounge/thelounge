import anyIntersection from "./anyIntersection";
import fill from "./fill";
import {ChannelPart} from "./findChannels";
import {EmojiPart} from "./findEmoji";
import {LinkPart} from "../../../../shared/linkify";
import {NamePart} from "./findNames";

export type Part = {
	start: number;
	end: number;
};

type TextPart = Part & {
	text: string;
};

type Fragment = {
	start: number;
	end: number;
	text: string;
};

type PartWithFragments = Part & {
	fragments: Fragment[];
};

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

export type MergedParts = (TextPart | NamePart | EmojiPart | ChannelPart | LinkPart)[];

// Merge the style fragments within the text parts, taking into account
// boundaries and text sections that have not matched to links or channels.
// For example, given a string "foobar" where "foo" and "bar" have been
// identified as parts (channels, links, etc.) and "fo", "ob" and "ar" have 3
// different styles, the first resulting part will contain fragments "fo" and
// "o", and the second resulting part will contain "b" and "ar". "o" and "b"
// fragments will contain duplicate styling attributes.
function merge(
	parts: MergedParts,
	styleFragments: Fragment[],
	cleanText: string
): PartWithFragments[] {
	// Remove overlapping parts
	parts = parts.sort(sortParts).reduce<MergedParts>((prev, curr) => {
		const intersection = prev.some((p) => anyIntersection(p, curr));

		if (intersection) {
			return prev;
		}

		return prev.concat([curr]);
	}, []);

	// Every section of the original text that has not been captured in a "part"
	// is filled with "text" parts, dummy objects with start/end but no extra
	// metadata.

	const filled = fill(parts, cleanText) as TextPart[];
	const allParts: MergedParts = [...parts, ...filled].sort(sortParts); // Sort all parts identified based on their position in the original text

	// Distribute the style fragments within the text parts
	return allParts.map((part: any) => {
		part.fragments = styleFragments
			.filter((fragment) => anyIntersection(part, fragment))
			.map((fragment) => assign(part, fragment));

		return part as PartWithFragments;
	});
}

export default merge;
