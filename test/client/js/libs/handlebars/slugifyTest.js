"use strict";

const expect = require("chai").expect;
const slugify = require("../../../../../client/js/libs/handlebars/slugify");

describe("slugify Handlebars helper", function() {
	it("should only produce lowercase strings", function() {
		expect(slugify("#TheLounge")).to.equal("\\#thelounge");
	});
});
