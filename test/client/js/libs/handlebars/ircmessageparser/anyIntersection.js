"use strict";

const expect = require("chai").expect;
const anyIntersection = require("../../../../../../client/js/libs/handlebars/ircmessageparser/anyIntersection");

describe("anyIntersection", () => {
	it("should not intersect on edges", () => {
		const a = {start: 1, end: 2};
		const b = {start: 2, end: 3};

		expect(anyIntersection(a, b)).to.equal(false);
		expect(anyIntersection(b, a)).to.equal(false);
	});

	it("should intersect on overlapping", () => {
		const a = {start: 0, end: 3};
		const b = {start: 1, end: 2};

		expect(anyIntersection(a, b)).to.equal(true);
		expect(anyIntersection(b, a)).to.equal(true);
	});

	it("should not intersect", () => {
		const a = {start: 0, end: 1};
		const b = {start: 2, end: 3};

		expect(anyIntersection(a, b)).to.equal(false);
		expect(anyIntersection(b, a)).to.equal(false);
	});
});
