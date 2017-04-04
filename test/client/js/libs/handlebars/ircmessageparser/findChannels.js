"use strict";

const expect = require("chai").expect;
const findChannels = require("../../../../../../client/js/libs/handlebars/ircmessageparser/findChannels");

describe("findChannels", () => {
	it("should find single letter channel", () => {
		const input = "#a";
		const expected = [{
			channel: "#a",
			start: 0,
			end: 2
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should find utf8 channels", () => {
		const input = "#äöü";
		const expected = [{
			channel: "#äöü",
			start: 0,
			end: 4
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should find inline channel", () => {
		const input = "inline #channel text";
		const expected = [{
			channel: "#channel",
			start: 7,
			end: 15
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should stop at \\0x07", () => {
		const input = "#chan\x07nel";
		const expected = [{
			channel: "#chan",
			start: 0,
			end: 5
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should allow classics pranks", () => {
		const input = "#1,000";
		const expected = [{
			channel: "#1,000",
			start: 0,
			end: 6
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should work with whois reponses", () => {
		const input = "@#a";
		const expected = [{
			channel: "#a",
			start: 1,
			end: 3
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should work with IRCv3.1 multi-prefix", () => {
		const input = "!@%+#a";
		const expected = [{
			channel: "#a",
			start: 4,
			end: 6
		}];

		const actual = findChannels(input, ["#"], ["!", "@", "%", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should work with custom channelPrefixes", () => {
		const input = "@a";
		const expected = [{
			channel: "@a",
			start: 0,
			end: 2
		}];

		const actual = findChannels(input, ["@"], ["#", "+"]);

		expect(actual).to.deep.equal(expected);
	});

	it("should handle multiple channelPrefix correctly", () => {
		const input = "##test";
		const expected = [{
			channel: "##test",
			start: 0,
			end: 6
		}];

		const actual = findChannels(input, ["#"], ["@", "+"]);

		expect(actual).to.deep.equal(expected);
	});
});
