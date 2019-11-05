"use strict";

const expect = require("chai").expect;
const roundBadgeNumber = require("../../../../client/js/helpers/roundBadgeNumber");

describe("roundBadgeNumber helper", function() {
	it("should return any number under 1000 as a string", function() {
		expect(roundBadgeNumber(123)).to.equal("123");
	});

	it("should return numbers above 999 in thousands", function() {
		expect(roundBadgeNumber(1000)).to.be.equal("1.0k");
	});

	it("should round and not floor", function() {
		expect(roundBadgeNumber(9999)).to.be.equal("10.0k");
	});

	it("should always include a single digit when rounding up", function() {
		expect(roundBadgeNumber(1234)).to.be.equal("1.2k");
		expect(roundBadgeNumber(12345)).to.be.equal("12.3k");
		expect(roundBadgeNumber(123456)).to.be.equal("123.4k");
	});
});
