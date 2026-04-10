// Unicode-aware word boundary detection for IRC nick matching.
// Uses Intl.Segmenter to prevent false nick matches inside words with
// apostrophes (e.g. "it's") or non-ASCII characters (e.g. "naïve").
// See https://github.com/thelounge/thelounge/issues/2008

const segmenter = new Intl.Segmenter(undefined, {granularity: "word"});

export type WordSegment = {start: number; end: number};

export function getWordSegments(text: string): WordSegment[] {
	const segments: WordSegment[] = [];

	for (const segment of segmenter.segment(text)) {
		if (segment.isWordLike) {
			segments.push({
				start: segment.index,
				end: segment.index + segment.segment.length,
			});
		}
	}

	return segments;
}

// Returns true if the range [matchStart, matchEnd) does NOT start or end
// in the interior of a word-like segment. Segments must be sorted by start.
export function isAtWordBoundary(
	wordSegments: WordSegment[],
	matchStart: number,
	matchEnd: number
): boolean {
	for (const seg of wordSegments) {
		if (seg.start > matchEnd) break;

		if (
			(seg.start < matchStart && matchStart < seg.end) ||
			(seg.start < matchEnd && matchEnd < seg.end)
		) {
			return false;
		}
	}

	return true;
}
