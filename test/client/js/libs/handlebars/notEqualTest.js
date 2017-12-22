"use strict";

const expect = require("chai").expect;
const notEqual = require("../../../../../client/js/libs/handlebars/notEqual");

describe("notEqual Handlebars helper", function() {
	const block = {
		fn: () => "fn",
	};

	it("should render the block if both values are equal", function() {
		expect(notEqual("foo", "bar", block)).to.equal("fn");
	});

	it("should throw if too few or too many arguments are given", function() {
		expect(() => notEqual("foo", block)).to.throw(Error, /expects 3 arguments/);

		expect(() => notEqual("foo", "bar", "baz", block))
			.to.throw(Error, /expects 3 arguments/);
	});

	it("should throw if too few or too many arguments are given", function() {
		const blockWithElse = {
			fn: () => "fn",
			inverse: () => "inverse",
		};

		expect(() => notEqual("foo", "foo", blockWithElse)).to.throw(Error, /else/);
	});
});
