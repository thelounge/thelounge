import {expect} from "chai";
import findNames from "../../../../../client/js/helpers/ircmessageparser/findNames";

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

	it("should not find nicks as part of a bigger string (issue #1776)", () => {
		const input = "you're very unlucky, luck";
		const expected = [
			{
				start: 21,
				end: 25,
				nick: "luck",
			},
		];
		const nicks = ["luck"];
		const actual = findNames(input, nicks);

		expect(actual).to.deep.equal(expected);
	});

	it("should find nicks as short as one character (issue #1885)", () => {
		const input = "aaa aa abc a";
		const expected = [
			{
				start: 11,
				end: 12,
				nick: "a",
			},
		];
		const nicks = ["a"];
		const actual = findNames(input, nicks);

		expect(actual).to.deep.equal(expected);
	});

	it("should find same nick multiple times", () => {
		const input = "xPaw xPaw xPaw";
		const expected = [
			{
				start: 0,
				end: 4,
				nick: "xPaw",
			},
			{
				start: 5,
				end: 9,
				nick: "xPaw",
			},
			{
				start: 10,
				end: 14,
				nick: "xPaw",
			},
		];
		const nicks = ["xPaw", "xPaw", "xPaw"];
		const actual = findNames(input, nicks);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find nick inside a word with apostrophe (issue #2008)", () => {
		const nicks = ["S"];
		expect(findNames("it's going well", nicks)).to.deep.equal([]);
		expect(findNames("don't worry", ["t"])).to.deep.equal([]);
		expect(findNames("can't stop won't stop", ["t"])).to.deep.equal([]);
	});

	it("should find nick when it stands alone, even if short", () => {
		const input = "hey S, how are you?";
		const nicks = ["S"];
		const actual = findNames(input, nicks);

		expect(actual).to.deep.equal([
			{
				start: 4,
				end: 5,
				nick: "S",
			},
		]);
	});

	it("should not find nick inside a word with non-ASCII characters (issue #2008)", () => {
		// Umlauts and accented characters should not create false word boundaries
		expect(findNames("naïve approach", ["ve"])).to.deep.equal([]);
		expect(findNames("über cool", ["ber"])).to.deep.equal([]);
		expect(findNames("café latte", ["caf"])).to.deep.equal([]);
	});

	it("should find nicks with IRC special characters", () => {
		const input = "hello user|away!";
		const nicks = ["user|away"];
		const actual = findNames(input, nicks);

		expect(actual).to.deep.equal([
			{
				start: 6,
				end: 15,
				nick: "user|away",
			},
		]);
	});
});
