"use strict";

const expect = require("chai").expect;
const friendlysize = require("../../../../client/js/helpers/friendlysize");

describe("friendlysize helper", function() {
	it("should render big values in human-readable version", function() {
		expect(friendlysize(51200)).to.equal("50 KB");
	});

	it("should round with 1 digit", function() {
		expect(friendlysize(1234567)).to.equal("1.2 MB");
	});

	it("should render special case 0 as 0 Bytes", function() {
		expect(friendlysize(0)).to.equal("0 Bytes");
	});
});
