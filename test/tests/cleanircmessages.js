"use strict";

const expect = require("chai").expect;
const Helper = require("../../src/helper");

describe("Clean IRC messages", function() {
	it("should remove all formatting", function() {
		const testCases = [{
			input: "\x0303",
			expected: ""
		}, {
			input: "\x02bold",
			expected: "bold"
		}, {
			input: "\x038yellowText",
			expected: "yellowText"
		}, {
			input: "\x030,0white,white",
			expected: "white,white"
		}, {
			input: "\x034,8yellowBGredText",
			expected: "yellowBGredText"
		}, {
			input: "\x1ditalic",
			expected: "italic"
		}, {
			input: "\x1funderline",
			expected: "underline"
		}, {
			input: "\x02bold\x038yellow\x02nonBold\x03default",
			expected: "boldyellownonBolddefault"
		}, {
			input: "\x02bold\x02 \x02bold\x02",
			expected: "bold bold"
		}, {
			input: "\x02irc\x0f://\x1dfreenode.net\x0f/\x034,8thelounge",
			expected: "irc://freenode.net/thelounge"
		}, {
			input: "\x02#\x038,9thelounge",
			expected: "#thelounge"
		}];

		const actual = testCases.map((testCase) => Helper.cleanIrcMessage(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});
});
