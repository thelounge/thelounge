"use strict";

function fill(existingEntries, text) {
	let position = 0;
	const result = [];

	for (let i = 0; i < existingEntries.length; i++) {
		const textSegment = existingEntries[i];

		if (textSegment.start > position) {
			result.push({
				start: position,
				end: textSegment.start
			});
		}
		position = textSegment.end;
	}

	if (position < text.length) {
		result.push({
			start: position,
			end: text.length
		});
	}

	return result;
}

module.exports = fill;
