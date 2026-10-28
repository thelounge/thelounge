const failureWindow = 15 * 60 * 1000;
const baseDelay = 250;
const maxDelay = 30 * 1000;
const maxEntries = 10000;

type Entry = {
	failures: number;
	last: number;
};

const entries = new Map<string, Entry>();

function prune(now: number) {
	for (const [key, entry] of entries) {
		if (now - entry.last > failureWindow) {
			entries.delete(key);
		}
	}
}

export function failureDelay(keys: string[], now = Date.now()): number {
	let delay = 0;

	for (const key of keys) {
		const entry = entries.get(key);

		if (!entry || now - entry.last > failureWindow) {
			continue;
		}

		delay = Math.max(delay, Math.min(maxDelay, baseDelay * 2 ** (entry.failures - 1)));
	}

	return delay;
}

export function recordFailure(keys: string[], now = Date.now()) {
	if (entries.size >= maxEntries) {
		prune(now);
	}

	for (const key of keys) {
		const entry = entries.get(key);

		if (!entry || now - entry.last > failureWindow) {
			entries.set(key, {failures: 1, last: now});
		} else {
			entry.failures++;
			entry.last = now;
		}
	}
}

export function clearFailures(keys: string[]) {
	for (const key of keys) {
		entries.delete(key);
	}
}

export function resetThrottle() {
	entries.clear();
}
