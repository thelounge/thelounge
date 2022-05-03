"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const findEmoji = require("../../../../../client/js/helpers/ircmessageparser/findEmoji").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("findEmoji", () => {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should find default emoji presentation character", () => {
		const input = "test \u{231A} test";
		const expected = [
			{
				start: 5,
				end: 6,
				emoji: "\u{231A}",
			},
		];

		const actual = findEmoji(input);

		expect(actual).to.deep.equal(expected);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should find default text presentation character rendered as emoji", () => {
		const input = "test \u{2194}\u{FE0F} test";
		const expected = [
			{
				start: 5,
				end: 7,
				emoji: "\u{2194}\u{FE0F}",
			},
		];

		const actual = findEmoji(input);

		expect(actual).to.deep.equal(expected);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should find emoji modifier base", () => {
		const input = "test\u{1F469}test";
		const expected = [
			{
				start: 4,
				end: 6,
				emoji: "\u{1F469}",
			},
		];

		const actual = findEmoji(input);

		expect(actual).to.deep.equal(expected);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should find emoji modifier base followed by a modifier", () => {
		const input = "test\u{1F469}\u{1F3FF}test";
		const expected = [
			{
				start: 4,
				end: 8,
				emoji: "\u{1F469}\u{1F3FF}",
			},
		];

		const actual = findEmoji(input);

		expect(actual).to.deep.equal(expected);
	});
});
