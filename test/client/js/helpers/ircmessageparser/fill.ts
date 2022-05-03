"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const fill = require("../../../../../client/js/helpers/ircmessageparser/fill").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("fill", () => {
	const text = "01234567890123456789";

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should return an entry for the unmatched end of string", () => {
		const existingEntries = [
			{start: 0, end: 10},
			{start: 5, end: 15},
		];

		const expected = [{start: 15, end: 20}];

		const actual = fill(existingEntries, text);

		expect(actual).to.deep.equal(expected);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should return an entry per unmatched areas of the text", () => {
		const existingEntries = [
			{start: 0, end: 5},
			{start: 10, end: 15},
		];

		const expected = [
			{start: 5, end: 10},
			{start: 15, end: 20},
		];

		const actual = fill(existingEntries, text);

		expect(actual).to.deep.equal(expected);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not return anything when entries match all text", () => {
		const existingEntries = [
			{start: 0, end: 10},
			{start: 10, end: 20},
		];

		const actual = fill(existingEntries, text);

		expect(actual).to.be.empty;
	});
});
