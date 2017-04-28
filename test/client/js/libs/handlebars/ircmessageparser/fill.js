"use strict";

const expect = require("chai").expect;
const fill = require("../../../../../../client/js/libs/handlebars/ircmessageparser/fill");

describe("fill", () => {
	const text = "01234567890123456789";

	it("should return an entry for the unmatched end of string", () => {
		const existingEntries = [
			{start: 0, end: 10},
			{start: 5, end: 15},
		];

		const expected = [
			{start: 15, end: 20},
		];

		const actual = fill(existingEntries, text);

		expect(actual).to.deep.equal(expected);
	});

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

	it("should not return anything when entries match all text", () => {
		const existingEntries = [
			{start: 0, end: 10},
			{start: 10, end: 20},
		];

		const actual = fill(existingEntries, text);

		expect(actual).to.be.empty;
	});
});
