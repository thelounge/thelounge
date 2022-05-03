"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const merge = require("../../../../../client/js/helpers/ircmessageparser/merge").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("merge", () => {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should split style information", () => {
		const textParts = [
			{
				start: 0,
				end: 10,
				flag1: true,
			},
			{
				start: 10,
				end: 20,
				flag2: true,
			},
		];
		const styleFragments = [
			{
				start: 0,
				end: 5,
				text: "01234",
			},
			{
				start: 5,
				end: 15,
				text: "5678901234",
			},
			{
				start: 15,
				end: 20,
				text: "56789",
			},
		];

		const expected = [
			{
				start: 0,
				end: 10,
				flag1: true,
				fragments: [
					{
						start: 0,
						end: 5,
						text: "01234",
					},
					{
						start: 5,
						end: 10,
						text: "56789",
					},
				],
			},
			{
				start: 10,
				end: 20,
				flag2: true,
				fragments: [
					{
						start: 10,
						end: 15,
						text: "01234",
					},
					{
						start: 15,
						end: 20,
						text: "56789",
					},
				],
			},
		];

		const actual = merge(
			textParts,
			styleFragments,
			styleFragments.map((fragment) => fragment.text).join("")
		);

		expect(actual).to.deep.equal(expected);
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
	it("should not drop clean text", () => {
		const textParts = [
			{
				start: 0,
				end: 52,
				link: "https://github.com/xPaw/PHP-Source-Query/runs/175079",
			},
		];
		const styleFragments = [
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "https://github.com/xPaw/PHP-Source-Query/runs/175079 here's some text",
				start: 0,
				end: 69,
			},
		];

		const expected = [
			{
				link: "https://github.com/xPaw/PHP-Source-Query/runs/175079",
				start: 0,
				end: 52,
				fragments: [
					{
						bold: false,
						textColor: undefined,
						bgColor: undefined,
						hexColor: undefined,
						hexBgColor: undefined,
						italic: false,
						underline: false,
						strikethrough: false,
						monospace: false,
						text: "https://github.com/xPaw/PHP-Source-Query/runs/175079",
						start: 0,
						end: 52,
					},
				],
			},
			{
				start: 52,
				end: 69,
				fragments: [
					{
						bold: false,
						textColor: undefined,
						bgColor: undefined,
						hexColor: undefined,
						hexBgColor: undefined,
						italic: false,
						underline: false,
						strikethrough: false,
						monospace: false,
						text: " here's some text",
						start: 52,
						end: 69,
					},
				],
			},
		];

		const actual = merge(
			textParts,
			styleFragments,
			styleFragments.map((fragment) => fragment.text).join("")
		);

		expect(actual).to.deep.equal(expected);
	});
});
