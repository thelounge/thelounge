"use strict";

const expect = require("chai").expect;
const parseStyle = require("../../../../../../client/js/libs/handlebars/ircmessageparser/parseStyle");

describe("parseStyle", () => {
	it("should skip control codes", () => {
		const input = "text\x01with\x04control\x05codes";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "textwithcontrolcodes",

			start: 0,
			end: 20,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse bold", () => {
		const input = "\x02bold";
		const expected = [{
			bold: true,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "bold",

			start: 0,
			end: 4,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse strikethrough", () => {
		const input = "\x1estrikethrough text\x1e";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: true,
			text: "strikethrough text",

			start: 0,
			end: 18,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse strikethrough and italics", () => {
		const input = "\x1ditalic formatting \x1ewith strikethrough\x1d no italic \x1e and vanilla";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: true,
			underline: false,
			strikethrough: false,
			text: "italic formatting ",

			start: 0,
			end: 18,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: true,
			underline: false,
			strikethrough: true,
			text: "with strikethrough",

			start: 18,
			end: 36,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: true,
			text: " no italic ",

			start: 36,
			end: 47,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: " and vanilla",

			start: 47,
			end: 59,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse strikethrough and text colors", () => {
		const input = "\x031,2text with color \x1eand strikethrough\x1e\x03";
		const expected = [{
			bold: false,
			textColor: 1,
			bgColor: 2,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "text with color ",

			start: 0,
			end: 16,
		}, {
			bold: false,
			textColor: 1,
			bgColor: 2,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: true,
			text: "and strikethrough",

			start: 16,
			end: 33,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should correctly parse multiple unclosed format tokens", () => {
		const input = "\x1e\x02\x1d\x033,4string with multiple unclosed formats";
		const expected = [{
			bold: true,
			textColor: 3,
			bgColor: 4,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: true,
			underline: false,
			strikethrough: true,
			text: "string with multiple unclosed formats",

			start: 0,
			end: 37,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should toggle strikethrough correctly", () => {
		const input = "toggling \x1eon and \x1eoff and \x1eon again\x1e";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "toggling ",

			start: 0,
			end: 9,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: true,
			text: "on and ",

			start: 9,
			end: 16,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "off and ",

			start: 16,
			end: 24,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: true,
			text: "on again",

			start: 24,
			end: 32,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse textColor", () => {
		const input = "\x038yellowText";
		const expected = [{
			bold: false,
			textColor: 8,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "yellowText",

			start: 0,
			end: 10,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse textColor and background", () => {
		const input = "\x034,8yellowBG redText";
		const expected = [{
			textColor: 4,
			bgColor: 8,
			hexColor: undefined,
			hexBgColor: undefined,
			bold: false,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "yellowBG redText",

			start: 0,
			end: 16,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse italic", () => {
		const input = "\x1ditalic";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: true,
			underline: false,
			strikethrough: false,
			text: "italic",

			start: 0,
			end: 6,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse hex colors", () => {
		const input = "test \x04FFFFFFnice \x02\x04RES006 \x0303,04\x04ff00FFcolored\x04eeeaFF,001122 background\x04\x03\x02?";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "test ",

			start: 0,
			end: 5,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: "FFFFFF",
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "nice ",

			start: 5,
			end: 10,
		}, {
			bold: true,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "RES006 ",

			start: 10,
			end: 17,
		}, {
			bold: true,
			textColor: 3,
			bgColor: 4,
			hexColor: "FF00FF",
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "colored",

			start: 17,
			end: 24,
		}, {
			bold: true,
			textColor: 3,
			bgColor: 4,
			hexColor: "EEEAFF",
			hexBgColor: "001122",
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: " background",

			start: 24,
			end: 35,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "?",

			start: 35,
			end: 36,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should carry state correctly forward", () => {
		const input = "\x02bold\x038yellow\x02nonBold\x03default";
		const expected = [{
			bold: true,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "bold",

			start: 0,
			end: 4,
		}, {
			bold: true,
			textColor: 8,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "yellow",

			start: 4,
			end: 10,
		}, {
			bold: false,
			textColor: 8,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "nonBold",

			start: 10,
			end: 17,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "default",

			start: 17,
			end: 24,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should toggle bold correctly", () => {
		const input = "\x02bold\x02 \x02bold\x02";
		const expected = [{
			bold: true,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "bold",

			start: 0,
			end: 4,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: " ",

			start: 4,
			end: 5,
		}, {
			bold: true,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "bold",

			start: 5,
			end: 9,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should reset all styles", () => {
		const input = "\x1e\x02\x034\x16\x1d\x1ffull\x0fnone";
		const expected = [{
			bold: true,
			textColor: 4,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: true,
			italic: true,
			underline: true,
			strikethrough: true,
			text: "full",

			start: 0,
			end: 4,
		}, {
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "none",

			start: 4,
			end: 8,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should not emit empty fragments", () => {
		const input = "\x031\x031,2\x031\x031,2\x031\x031,2\x03a";
		const expected = [{
			bold: false,
			textColor: undefined,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: "a",

			start: 0,
			end: 1,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should optimize fragments", () => {
		const rawString = "oh hi test text";
		const colorCode = "\x0312";
		const input = colorCode + rawString.split("").join(colorCode);
		const expected = [{
			bold: false,
			textColor: 12,
			bgColor: undefined,
			hexColor: undefined,
			hexBgColor: undefined,
			reverse: false,
			italic: false,
			underline: false,
			strikethrough: false,
			text: rawString,

			start: 0,
			end: rawString.length,
		}];

		const actual = parseStyle(input);

		expect(actual).to.deep.equal(expected);
	});
});
