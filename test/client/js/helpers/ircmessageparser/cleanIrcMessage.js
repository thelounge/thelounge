"use strict";

const expect = require("chai").expect;
const cleanIrcMessage = require("../../../../../client/js/helpers/ircmessageparser/cleanIrcMessage");

describe("cleanIrcMessage", function() {
	it("should remove all formatting", function() {
		const testCases = [
			{
				input: "\x0303",
				expected: "",
			},
			{
				input: "\x02bold",
				expected: "bold",
			},
			{
				input: "\x038yellowText",
				expected: "yellowText",
			},
			{
				input: "\x030,0white,white",
				expected: "white,white",
			},
			{
				input: "\x034,8yellowBGredText",
				expected: "yellowBGredText",
			},
			{
				input: "\x1ditalic",
				expected: "italic",
			},
			{
				input: "\x1estrikethrough",
				expected: "strikethrough",
			},
			{
				input: "\x11monospace",
				expected: "monospace",
			},
			{
				input: "\x16reset color",
				expected: "reset color",
			},
			{
				input: "\x1funderline",
				expected: "underline",
			},
			{
				input: "\x02bold\x038yellow\x02nonBold\x03default",
				expected: "boldyellownonBolddefault",
			},
			{
				input: "\x02bold\x02 \x02bold\x02",
				expected: "bold bold",
			},
			{
				input: "\x02irc\x0f://\x1dfreenode.net\x0f/\x034,8thelounge",
				expected: "irc://freenode.net/thelounge",
			},
			{
				input: "\x02#\x038,9thelounge",
				expected: "#thelounge",
			},
			{
				input: "\x04DDEEAA,BBEEFF#\x038,9thelou\x04FFAACC\x0311\x04nge",
				expected: "#thelounge",
			},
			{
				input: "\x04ddEEffhex\x04 color\x04EEffCC,AAaaCC clean",
				expected: "hex color clean",
			},
			{
				input: "\x04 AAaaAA\x03 11 \x04Invalid,Hex ",
				expected: "AAaaAA 11 Invalid,Hex",
			},
		];

		const actual = testCases.map((testCase) => cleanIrcMessage(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});
});
