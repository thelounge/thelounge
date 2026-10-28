import {expect} from "vitest";
import {
	clearFailures,
	failureDelay,
	recordFailure,
	resetThrottle,
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
});
