"use strict";

const expect = require("chai").expect;
const findNames = require("../../../../../../client/js/libs/handlebars/ircmessageparser/findNames");

describe("findNames", () => {
	it("should find nicks in text", () => {
		const input = "<MaxLeiter>: Hello, xPaw, how's it going?";
		const expected = [
			{
				start: 1,
				end: 10,
				nick: "MaxLeiter",
			},
			{
				start: 20,
				end: 24,
				nick: "xPaw",
			},
		];
		const nicks = ["MaxLeiter", "xPaw"];
		const actual = findNames(input, nicks);

		expect(actual).to.deep.equal(expected);
	});
});
