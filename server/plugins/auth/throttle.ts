import net from "net";

const failureWindow = 15 * 60 * 1000;
const baseDelay = 250;
const maxDelay = {ip: 30 * 1000, user: 2 * 1000};
const maxKeyLength = 128;

export const maxEntries = 10000;

type Entry = {
	failures: number;
	last: number;
};

type Bucket = keyof typeof maxDelay;

const buckets: Record<Bucket, Map<string, Entry>> = {ip: new Map(), user: new Map()};
const pending = new Set<string>();

function normalise(key: string) {
	return key.slice(0, maxKeyLength);
}

function bucketOf(key: string): Bucket {
	return key.startsWith("user:") ? "user" : "ip";
}

function delayFor(key: string, failures: number) {
	return Math.min(maxDelay[bucketOf(key)], baseDelay * 2 ** (failures - 1));
}

function liveEntry(key: string, now: number) {
	const entry = buckets[bucketOf(key)].get(normalise(key));

	if (!entry || now - entry.last > failureWindow) {
		return undefined;
	}

	return entry;
}

function prune(entries: Map<string, Entry>, now: number) {
	for (const [key, entry] of entries) {
		if (now - entry.last > failureWindow) {
			entries.delete(key);
		}
	}

	while (entries.size >= maxEntries) {
		let oldest: string | undefined;
		let oldestTime = Infinity;

		for (const [key, entry] of entries) {
			if (entry.last < oldestTime) {
				oldest = key;
				oldestTime = entry.last;
			}
		}

		entries.delete(oldest!);
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
			delay = Math.max(delay, delayFor(key, entry.failures));
		}
	}

	return delay;
}

export function retryAfter(keys: string[], now = Date.now()): number {
	let wait = 0;

	for (const key of keys) {
		const entry = liveEntry(key, now);

		if (entry) {
			wait = Math.max(wait, entry.last + delayFor(key, entry.failures) - now);
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
	for (const key of keys) {
		const entries = buckets[bucketOf(key)];
		const entry = liveEntry(key, now);

		if (entry) {
			entry.failures++;
			entry.last = now;
			continue;
		}

		if (entries.size >= maxEntries) {
			prune(entries, now);
		}

		entries.set(normalise(key), {failures: 1, last: now});
	}
}

export function clearFailures(keys: string[]) {
	for (const key of keys) {
		buckets[bucketOf(key)].delete(normalise(key));
	}
}

export function throttleSize() {
	return buckets.ip.size + buckets.user.size;
}

export function resetThrottle() {
	buckets.ip.clear();
	buckets.user.clear();
	pending.clear();
}
