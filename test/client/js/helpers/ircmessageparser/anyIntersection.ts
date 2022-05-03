"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const anyIntersection =
	require("../../../../../client/js/helpers/ircmessageparser/anyIntersection").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("anyIntersection", () => {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not intersect on edges", () => {
		const a = {start: 1, end: 2};
		const b = {start: 2, end: 3};

		expect(anyIntersection(a, b)).to.equal(false);
		expect(anyIntersection(b, a)).to.equal(false);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should intersect on overlapping", () => {
		const a = {start: 0, end: 3};
		const b = {start: 1, end: 2};

		expect(anyIntersection(a, b)).to.equal(true);
		expect(anyIntersection(b, a)).to.equal(true);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not intersect", () => {
		const a = {start: 0, end: 1};
		const b = {start: 2, end: 3};

		expect(anyIntersection(a, b)).to.equal(false);
		expect(anyIntersection(b, a)).to.equal(false);
	});
});
