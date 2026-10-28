import fuzzy from "fuzzy";
import escape from "lodash/escape";

const pre = "\u0001";
const post = "\u0002";

export type FuzzyResult<T> = {
	string: string;
	original: T;
};

// Wraps fuzzy.filter so that the rendered string is safe to insert as HTML:
// the matched characters are wrapped in <b>, everything else is escaped.
export default function fuzzyFilter<T>(
	pattern: string,
	items: T[],
	extract?: (item: T) => string
): FuzzyResult<T>[] {
	return fuzzy.filter(pattern, items, {pre, post, extract}).map((result) => ({
		string: escape(result.string)
			.replace(new RegExp(pre, "g"), "<b>")
			.replace(new RegExp(post, "g"), "</b>"),
		original: result.original,
	}));
}
