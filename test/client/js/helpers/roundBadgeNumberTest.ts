import {expect} from "chai";
import roundBadgeNumber from "../../../../client/js/helpers/roundBadgeNumber";

describe("roundBadgeNumber helper", function () {
	it("should return any number under 1000 as a string", function () {
		expect(roundBadgeNumber(123)).to.equal("123");
	});

	it("should return numbers between 1000 and 999999 with a 'k' suffix", function () {
		expect(roundBadgeNumber(1000)).to.be.equal("1.0k");
	});

	it("should return numbers above 999999 with a 'm' suffix", function () {
		expect(roundBadgeNumber(1000000)).to.be.equal("1.0m");
		expect(roundBadgeNumber(1234567)).to.be.equal("1.2m");
	});

	it("should round and not floor", function () {
		expect(roundBadgeNumber(9999)).to.be.equal("10.0k");
	});

	it("should always include a single digit when rounding up", function () {
		expect(roundBadgeNumber(1234)).to.be.equal("1.2k");
		expect(roundBadgeNumber(12345)).to.be.equal("12.3k");
		expect(roundBadgeNumber(123456)).to.be.equal("123.4k");
	});
});
