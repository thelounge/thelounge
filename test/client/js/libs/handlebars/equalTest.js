"use strict";

const expect = require("chai").expect;
const equal = require("../../../../../client/js/libs/handlebars/equal");

describe("equal Handlebars helper", function() {
	const block = {
		fn: () => "fn",
		inverse: () => "inverse",
	};

	it("should render the first block if both values are equal", function() {
		expect(equal("foo", "foo", block)).to.equal("fn");
	});

	it("should render the inverse block if values are not equal", function() {
		expect(equal("foo", "bar", block)).to.equal("inverse");
	});

	it("should throw if too few or too many arguments are given", function() {
		expect(() => equal("foo", block)).to.throw(Error, /expects 3 arguments/);

		expect(() => equal("foo", "bar", "baz", block))
			.to.throw(Error, /expects 3 arguments/);
	});
});
