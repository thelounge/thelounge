const failureWindow = 15 * 60 * 1000;
const baseDelay = 250;
const maxDelay = 30 * 1000;
const maxKeyLength = 128;

export const maxEntries = 10000;

type Entry = {
	failures: number;
	last: number;
};

const entries = new Map<string, Entry>();

function delayFor(failures: number) {
	return Math.min(maxDelay, baseDelay * 2 ** (failures - 1));
}

function liveEntry(key: string, now: number) {
	const entry = entries.get(key.slice(0, maxKeyLength));

	if (!entry || now - entry.last > failureWindow) {
		return undefined;
	}

	return entry;
}

function prune(now: number) {
	for (const [key, entry] of entries) {
		if (now - entry.last > failureWindow) {
			entries.delete(key);
		}
	}

	for (const key of entries.keys()) {
		if (entries.size < maxEntries) {
			break;
		}

		entries.delete(key);
	}
}

export function failureDelay(keys: string[], now = Date.now()): number {
	let delay = 0;

	for (const key of keys) {
		const entry = liveEntry(key, now);

		if (entry) {
			delay = Math.max(delay, delayFor(entry.failures));
		}
	}

	return delay;
}

export function retryAfter(keys: string[], now = Date.now()): number {
	let wait = 0;

	for (const key of keys) {
		const entry = liveEntry(key, now);

		if (entry) {
			wait = Math.max(wait, entry.last + delayFor(entry.failures) - now);
		}
	}

	return wait;
}

export function recordFailure(keys: string[], now = Date.now()) {
	if (entries.size >= maxEntries) {
		prune(now);
	}

	for (const key of keys) {
		const entry = liveEntry(key, now);

		if (entry) {
			entry.failures++;
			entry.last = now;
		} else {
			entries.set(key.slice(0, maxKeyLength), {failures: 1, last: now});
		}
	}
}

export function clearFailures(keys: string[]) {
	for (const key of keys) {
		entries.delete(key.slice(0, maxKeyLength));
	}
}

export function throttleSize() {
	return entries.size;
}

export function resetThrottle() {
	entries.clear();
}
