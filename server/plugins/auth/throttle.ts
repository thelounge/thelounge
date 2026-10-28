import net from "net";

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
const pending = new Set<string>();

function normalise(key: string) {
	return key.slice(0, maxKeyLength);
}

function delayFor(failures: number) {
	return Math.min(maxDelay, baseDelay * 2 ** (failures - 1));
}

function liveEntry(key: string, now: number) {
	const entry = entries.get(normalise(key));

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

	while (entries.size >= maxEntries) {
		let fewest = Infinity;

		for (const entry of entries.values()) {
			fewest = Math.min(fewest, entry.failures);
		}

		for (const [key, entry] of entries) {
			if (entries.size < maxEntries) {
				break;
			}

			if (entry.failures === fewest) {
				entries.delete(key);
			}
		}
	}
}

export function addressKey(address: string): string {
	if (net.isIPv6(address)) {
		const [head, tail = ""] = address.split("::");
		const groups = head.split(":").filter(Boolean);
		const missing = 8 - groups.length - tail.split(":").filter(Boolean).length;

		groups.push(...new Array(Math.max(0, missing)).fill("0"));

		return `ip:${groups.slice(0, 4).join(":")}::/64`;
	}

	return `ip:${address}`;
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

export function beginAttempt(keys: string[]): boolean {
	if (keys.some((key) => pending.has(normalise(key)))) {
		return false;
	}

	for (const key of keys) {
		pending.add(normalise(key));
	}

	return true;
}

export function endAttempt(keys: string[]) {
	for (const key of keys) {
		pending.delete(normalise(key));
	}
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
			entries.set(normalise(key), {failures: 1, last: now});
		}
	}
}

export function clearFailures(keys: string[]) {
	for (const key of keys) {
		entries.delete(normalise(key));
	}
}

export function throttleSize() {
	return entries.size;
}

export function resetThrottle() {
	entries.clear();
	pending.clear();
}
