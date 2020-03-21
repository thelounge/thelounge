"use strict";

const expect = require("chai").expect;
const Helper = require("../../src/helper");

describe("HexIP", function () {
	it("should correctly convert IPv4 to hex", function () {
		expect(Helper.ip2hex("66.124.160.150")).to.equal("427ca096");
		expect(Helper.ip2hex("127.0.0.1")).to.equal("7f000001");
		expect(Helper.ip2hex("0.0.0.255")).to.equal("000000ff");
	});

	it("unsupported addresses return default", function () {
		expect(Helper.ip2hex("0.0.0.999")).to.equal("00000000");
		expect(Helper.ip2hex("localhost")).to.equal("00000000");
		expect(Helper.ip2hex("::1")).to.equal("00000000");
		expect(Helper.ip2hex("2606:2800:220:1:248:1893:25c8:1946")).to.equal("00000000");
	});
});
