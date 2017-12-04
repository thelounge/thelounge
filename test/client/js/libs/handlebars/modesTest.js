"use strict";

const expect = require("chai").expect;
const modes = require("../../../../../client/js/libs/handlebars/modes");

describe("modes Handlebars helper", function() {
	it("should return text modes based on symbols", function() {
		expect(modes("~")).to.equal("owner");
		expect(modes("&")).to.equal("admin");
		expect(modes("!")).to.equal("admin");
		expect(modes("@")).to.equal("op");
		expect(modes("%")).to.equal("half-op");
		expect(modes("+")).to.equal("voice");
	});

	it("should return no special mode when given an empty string", function() {
		expect(modes("")).to.equal("normal");
	});

	it("should return nothing if the symbol does not exist", function() {
		expect(modes("?")).to.be.undefined;
	});
});
