// Unsent input is shared between all clients of a user. Clients type
// independently (and sometimes while offline), so a timestamp or "last write
// wins" would let one device wipe out what is being typed on another. Instead,
// every draft records which edits it is based on, and a client only replaces its
// own text with a draft whose author had already seen that text.

// One [author, counter] entry per author that contributed to a draft, ordered so
// that the last entry identifies the edit which produced the current text.
export type DraftVersion = [string, number][];

export type Draft = {
	text: string;
	version: DraftVersion;
};

export const MAX_DRAFT_LENGTH = 20_000;

// Authors are page loads, so old entries have to be dropped at some point. A
// client that is further behind than this is treated as having typed
// independently, which keeps its text.
export const MAX_DRAFT_AUTHORS = 32;

// Whether `version` is the same as, or was derived from, `other`
export function draftIncludes(version: DraftVersion, other: DraftVersion): boolean {
	if (other.length === 0) {
		return true;
	}

	const [author, counter] = other[other.length - 1];

	return version.some(([a, c]) => a === author && c >= counter);
}

export function editDraftVersion(
	version: DraftVersion,
	author: string,
	counter: number
): DraftVersion {
	const others = version.filter(([a]) => a !== author);

	return [...others, [author, counter] as [string, number]].slice(-MAX_DRAFT_AUTHORS);
}

// Version which includes both arguments, identifying its text as that of `latest`
export function mergeDraftVersions(older: DraftVersion, latest: DraftVersion): DraftVersion {
	const counters = new Map(older);
	const merged = latest.map(
		([author, counter]) =>
			[author, Math.max(counter, counters.get(author) ?? 0)] as [string, number]
	);
	const rest = older.filter(([author]) => !latest.some(([a]) => a === author));

	return [...rest, ...merged].slice(-MAX_DRAFT_AUTHORS);
}

// Drafts come from clients and from files on disk, neither of which can be trusted
export function isValidDraft(draft: any): draft is Draft {
	return Boolean(
		typeof draft?.text === "string" &&
			draft.text.length <= MAX_DRAFT_LENGTH &&
			Array.isArray(draft.version) &&
			draft.version.length > 0 &&
			draft.version.length <= MAX_DRAFT_AUTHORS &&
			draft.version.every(
				(entry: any) =>
					Array.isArray(entry) &&
					entry.length === 2 &&
					typeof entry[0] === "string" &&
					entry[0].length <= 64 &&
					Number.isSafeInteger(entry[1])
			)
	);
}
