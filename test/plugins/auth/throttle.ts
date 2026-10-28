import {expect} from "vitest";
import {
	addressKey,
	beginAttempt,
	clearFailures,
	endAttempt,
	failureDelay,
	maxEntries,
	recordFailure,
	resetThrottle,
	retryAfter,
	throttleSize,
} from "../../../server/plugins/auth/throttle";

describe("auth throttle", function () {
	const now = 1_000_000;

	beforeEach(function () {
		resetThrottle();
	});

	it("does not delay a first attempt", function () {
		expect(failureDelay(["ip:1", "user:a"], now)).to.equal(0);
	});

	it("doubles the delay with each failure up to a cap", function () {
		const keys = ["user:a"];
		const expected = [250, 500, 1000, 2000, 4000, 8000, 16000, 30000, 30000];

		for (const delay of expected) {
			recordFailure(keys, now);
			expect(failureDelay(keys, now)).to.equal(delay);
		}
	});

	it("uses the largest delay of all keys", function () {
		recordFailure(["ip:1"], now);
		recordFailure(["ip:1"], now);
		recordFailure(["user:a"], now);

		expect(failureDelay(["ip:1", "user:a"], now)).to.equal(500);
		expect(failureDelay(["ip:2", "user:a"], now)).to.equal(250);
		expect(failureDelay(["ip:2", "user:b"], now)).to.equal(0);
	});

	it("forgets failures after the window", function () {
		recordFailure(["user:a"], now);
		recordFailure(["user:a"], now);

		expect(failureDelay(["user:a"], now + 15 * 60 * 1000)).to.equal(500);
		expect(failureDelay(["user:a"], now + 15 * 60 * 1000 + 1)).to.equal(0);

		recordFailure(["user:a"], now + 15 * 60 * 1000 + 1);
		expect(failureDelay(["user:a"], now + 15 * 60 * 1000 + 1)).to.equal(250);
	});

	it("clears failures on success", function () {
		recordFailure(["ip:1", "user:a"], now);
		clearFailures(["ip:1", "user:a"]);

		expect(failureDelay(["ip:1", "user:a"], now)).to.equal(0);
	});

	it("blocks new attempts until the delay has passed", function () {
		recordFailure(["user:a"], now);
		recordFailure(["user:a"], now + 100);

		expect(retryAfter(["user:a"], now + 100)).to.equal(500);
		expect(retryAfter(["user:a"], now + 400)).to.equal(200);
		expect(retryAfter(["user:a"], now + 600)).to.equal(0);
		expect(retryAfter(["user:b"], now + 100)).to.equal(0);
	});

	it("treats keys longer than the limit as the same key", function () {
		const long = "user:" + "a".repeat(200);

		recordFailure([long], now);

		expect(failureDelay([long + "b"], now)).to.equal(250);
	});

	it("keeps the number of entries bounded and evicts the least throttled first", function () {
		recordFailure(["user:target"], now);
		recordFailure(["user:target"], now);

		for (let i = 0; i < maxEntries + 100; i++) {
			recordFailure([`ip:${i}`], now);
		}

		expect(throttleSize()).to.be.at.most(maxEntries);
		expect(failureDelay(["user:target"], now)).to.equal(500);
		expect(failureDelay([`ip:${maxEntries + 99}`], now)).to.equal(250);
	});

	it("allows only one attempt at a time per key", function () {
		expect(beginAttempt(["ip:1", "user:a"])).to.be.true;
		expect(beginAttempt(["ip:2", "user:a"])).to.be.false;
		expect(beginAttempt(["ip:1", "user:b"])).to.be.false;
		expect(beginAttempt(["ip:2", "user:b"])).to.be.true;

		endAttempt(["ip:1", "user:a"]);

		expect(beginAttempt(["ip:2", "user:a"])).to.be.false;
		expect(beginAttempt(["ip:1", "user:a"])).to.be.true;
	});

	it("keys ipv6 addresses by their /64", function () {
		expect(addressKey("198.51.100.7")).to.equal("ip:198.51.100.7");
		expect(addressKey("2001:db8:1:2:3:4:5:6")).to.equal("ip:2001:db8:1:2::/64");
		expect(addressKey("2001:db8:1:2::6")).to.equal("ip:2001:db8:1:2::/64");
		expect(addressKey("2001:db8::6")).to.equal("ip:2001:db8:0:0::/64");
		expect(addressKey("::1")).to.equal("ip:0:0:0:0::/64");
		expect(addressKey("2001:db8:1:2:ffff::")).to.equal("ip:2001:db8:1:2::/64");
	});
});
