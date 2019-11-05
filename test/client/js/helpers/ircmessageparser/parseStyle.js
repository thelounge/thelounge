"use strict";

const expect = require("chai").expect;
const parseStyle = require("../../../../../client/js/helpers/ircmessageparser/parseStyle");

describe("parseStyle", () => {
	it("should skip control codes", () => {
		const input = "text\x01with\x04control\x05codes";
		const expected = [
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
				text: "textwithcontrolcodes",

				start: 0,
				end: 20,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse bold", () => {
		const input = "\x02bold";
		const expected = [
			{
				bold: true,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "bold",

				start: 0,
				end: 4,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse strikethrough", () => {
		const input = "\x1estrikethrough text\x1e";
		const expected = [
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: "strikethrough text",

				start: 0,
				end: 18,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse monospace", () => {
		const input = "\x11monospace text\x1e";
		const expected = [
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: true,
				text: "monospace text",

				start: 0,
				end: 14,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should toggle monospace correctly", () => {
		const input = "toggling \x11on and \x11off and \x11on again\x11";
		const expected = [
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
				text: "toggling ",

				start: 0,
				end: 9,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: true,
				text: "on and ",

				start: 9,
				end: 16,
			},
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
				text: "off and ",

				start: 16,
				end: 24,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: true,
				text: "on again",

				start: 24,
				end: 32,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse monospace and underline", () => {
		const input =
			"\x1funderline formatting \x11with monospace\x1f no underline \x11 and vanilla";
		const expected = [
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: true,
				strikethrough: false,
				monospace: false,
				text: "underline formatting ",

				start: 0,
				end: 21,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: true,
				strikethrough: false,
				monospace: true,
				text: "with monospace",

				start: 21,
				end: 35,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: true,
				text: " no underline ",

				start: 35,
				end: 49,
			},
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
				text: " and vanilla",

				start: 49,
				end: 61,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse monospace and text colors", () => {
		const input = "\x037,9\x11text with color and monospace\x11\x03";
		const expected = [
			{
				bold: false,
				textColor: 7,
				bgColor: 9,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: true,
				text: "text with color and monospace",

				start: 0,
				end: 29,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse strikethrough and italics", () => {
		const input = "\x1ditalic formatting \x1ewith strikethrough\x1d no italic \x1e and vanilla";
		const expected = [
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: true,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "italic formatting ",

				start: 0,
				end: 18,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: true,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: "with strikethrough",

				start: 18,
				end: 36,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: " no italic ",

				start: 36,
				end: 47,
			},
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
				text: " and vanilla",

				start: 47,
				end: 59,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse strikethrough and text colors", () => {
		const input = "\x031,2text with color \x1eand strikethrough\x1e\x03";
		const expected = [
			{
				bold: false,
				textColor: 1,
				bgColor: 2,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "text with color ",

				start: 0,
				end: 16,
			},
			{
				bold: false,
				textColor: 1,
				bgColor: 2,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: "and strikethrough",

				start: 16,
				end: 33,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should correctly parse multiple unclosed format tokens", () => {
		const input = "\x1e\x02\x1d\x033,4string with multiple unclosed formats";
		const expected = [
			{
				bold: true,
				textColor: 3,
				bgColor: 4,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: true,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: "string with multiple unclosed formats",

				start: 0,
				end: 37,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should toggle strikethrough correctly", () => {
		const input = "toggling \x1eon and \x1eoff and \x1eon again\x1e";
		const expected = [
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
				text: "toggling ",

				start: 0,
				end: 9,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: "on and ",

				start: 9,
				end: 16,
			},
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
				text: "off and ",

				start: 16,
				end: 24,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: true,
				monospace: false,
				text: "on again",

				start: 24,
				end: 32,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse textColor", () => {
		const input = "\x038yellowText";
		const expected = [
			{
				bold: false,
				textColor: 8,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "yellowText",

				start: 0,
				end: 10,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse textColor and background", () => {
		const input = "\x034,8yellowBG redText";
		const expected = [
			{
				textColor: 4,
				bgColor: 8,
				hexColor: undefined,
				hexBgColor: undefined,
				bold: false,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "yellowBG redText",

				start: 0,
				end: 16,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse extended colors", () => {
		const input = "\x0370,99some text";
		const expected = [
			{
				textColor: 70,
				bgColor: 99,
				hexColor: undefined,
				hexBgColor: undefined,
				bold: false,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "some text",

				start: 0,
				end: 9,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse italic", () => {
		const input = "\x1ditalic";
		const expected = [
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: true,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "italic",

				start: 0,
				end: 6,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse hex colors", () => {
		const input =
			"test \x04FFFFFFnice \x02\x04RES006 \x0303,04\x04ff00FFcolored\x04eeeaFF,001122 background\x04\x03\x02?";
		const expected = [
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
				text: "test ",

				start: 0,
				end: 5,
			},
			{
				bold: false,
				textColor: undefined,
				bgColor: undefined,
				hexColor: "FFFFFF",
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "nice ",

				start: 5,
				end: 10,
			},
			{
				bold: true,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "RES006 ",

				start: 10,
				end: 17,
			},
			{
				bold: true,
				textColor: 3,
				bgColor: 4,
				hexColor: "FF00FF",
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "colored",

				start: 17,
				end: 24,
			},
			{
				bold: true,
				textColor: 3,
				bgColor: 4,
				hexColor: "EEEAFF",
				hexBgColor: "001122",
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: " background",

				start: 24,
				end: 35,
			},
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
				text: "?",

				start: 35,
				end: 36,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should reverse and format color", () => {
		const input = "\x032,9text with fg and bg \x16with text reversed";
		const expected = [
			{
				bold: false,
				textColor: 2,
				bgColor: 9,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "text with fg and bg ",

				start: 0,
				end: 20,
			},
			{
				bold: false,
				textColor: 9,
				bgColor: 2,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "with text reversed",

				start: 20,
				end: 38,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should toggle reverse correctly", () => {
		const input = "\x0305,11text \x16reversed and \x16back again and \x16reversed";
		const expected = [
			{
				bold: false,
				textColor: 5,
				bgColor: 11,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "text ",

				start: 0,
				end: 5,
			},
			{
				bold: false,
				textColor: 11,
				bgColor: 5,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "reversed and ",

				start: 5,
				end: 18,
			},
			{
				bold: false,
				textColor: 5,
				bgColor: 11,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "back again and ",

				start: 18,
				end: 33,
			},
			{
				bold: false,
				textColor: 11,
				bgColor: 5,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "reversed",

				start: 33,
				end: 41,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should escape reverse when a new style is applied", () => {
		const input = "\x0311,02text \x16 reversed \x0304,05 and new style";
		const expected = [
			{
				bold: false,
				textColor: 11,
				bgColor: 2,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "text ",

				start: 0,
				end: 5,
			},
			{
				bold: false,
				textColor: 2,
				bgColor: 11,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: " reversed ",

				start: 5,
				end: 15,
			},
			{
				bold: false,
				textColor: 4,
				bgColor: 5,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: " and new style",

				start: 15,
				end: 29,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should not reverse if color is specified after reverse tag", () => {
		const input = "\x16\x032,9text with fg and bg";
		const expected = [
			{
				bold: false,
				textColor: 2,
				bgColor: 9,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "text with fg and bg",

				start: 0,
				end: 19,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should reverse, bold, and italics", () => {
		const input = "\x034,13\x16\x02some text with \x1ditalics";
		const expected = [
			{
				bold: true,
				textColor: 13,
				bgColor: 4,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "some text with ",

				start: 0,
				end: 15,
			},
			{
				bold: true,
				textColor: 13,
				bgColor: 4,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: true,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "italics",

				start: 15,
				end: 22,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should carry state correctly forward", () => {
		const input = "\x02bold\x038yellow\x02nonBold\x03default";
		const expected = [
			{
				bold: true,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "bold",

				start: 0,
				end: 4,
			},
			{
				bold: true,
				textColor: 8,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "yellow",

				start: 4,
				end: 10,
			},
			{
				bold: false,
				textColor: 8,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "nonBold",

				start: 10,
				end: 17,
			},
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
				text: "default",

				start: 17,
				end: 24,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should toggle bold correctly", () => {
		const input = "\x02bold\x02 \x02bold\x02";
		const expected = [
			{
				bold: true,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "bold",

				start: 0,
				end: 4,
			},
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
				text: " ",

				start: 4,
				end: 5,
			},
			{
				bold: true,
				textColor: undefined,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: "bold",

				start: 5,
				end: 9,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should reset all styles", () => {
		const input = "\x11\x1e\x02\x034\x16\x1d\x1ffull\x0fnone";
		const expected = [
			{
				bold: true,
				textColor: undefined,
				bgColor: 4, // \x16: fg- and bg- are reversed
				hexColor: undefined,
				hexBgColor: undefined,
				italic: true,
				underline: true,
				strikethrough: true,
				monospace: true,
				text: "full",

				start: 0,
				end: 4,
			},
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
				text: "none",

				start: 4,
				end: 8,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should not emit empty fragments", () => {
		const input = "\x031\x031,2\x031\x031,2\x031\x031,2\x03a";
		const expected = [
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
				text: "a",

				start: 0,
				end: 1,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should optimize fragments", () => {
		const rawString = "oh hi test text";
		const colorCode = "\x0312";
		const input = colorCode + rawString.split("").join(colorCode);
		const expected = [
			{
				bold: false,
				textColor: 12,
				bgColor: undefined,
				hexColor: undefined,
				hexBgColor: undefined,
				italic: false,
				underline: false,
				strikethrough: false,
				monospace: false,
				text: rawString,

				start: 0,
				end: rawString.length,
			},
		];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});
});
