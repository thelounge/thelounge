import storage from "../localStorage";

const STORAGE_KEY = "thelounge.emojiRecents";
const MAX_RECENTS = 12;

function read(): string[] {
	const raw = storage.get(STORAGE_KEY);

	if (!raw) {
		return [];
	}

	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
	} catch {
		return [];
	}
}

export function getRecents(): string[] {
	return read();
}

export function pushRecent(emoji: string): string[] {
	const next = [emoji, ...read().filter((e) => e !== emoji)].slice(0, MAX_RECENTS);
	storage.set(STORAGE_KEY, JSON.stringify(next));
	return next;
}
