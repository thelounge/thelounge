"use strict";

// Create plain text entries corresponding to areas of the text that match no
// existing entries. Returns an empty array if all parts of the text have been
// parsed into recognizable entries already.
function fill(existingEntries, text) {
	let position = 0;

	// Fill inner parts of the text. For example, if text is `foobarbaz` and both
	// `foo` and `baz` have matched into an entry, this will return a dummy entry
	// corresponding to `bar`.
	const result = existingEntries.reduce((acc, textSegment) => {
		if (textSegment.start > position) {
			acc.push({
				start: position,
				end: textSegment.start
			});
		}
		position = textSegment.end;
		return acc;
	}, []);

	// Complete the unmatched end of the text with a dummy entry
	if (position < text.length) {
		result.push({
			start: position,
			end: text.length
		});
	}

	return result;
}

module.exports = fill;
