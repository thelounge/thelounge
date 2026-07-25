import {expect} from "vitest";
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

	it("should not find nicks inside words with Unicode letters (issue #4930)", () => {
		const actual = findNames("Dzięki D", ["D"]);

		expect(actual).to.deep.equal([
			{
				start: 7,
				end: 8,
				nick: "D",
			},
		]);
	});

	it("should find Unicode and IRC nickname characters", () => {
		const actual = findNames("Ądam42 foo_bar [nick]", ["Ądam42", "foo_bar", "[nick]"]);

		expect(actual).to.deep.equal([
			{start: 0, end: 6, nick: "Ądam42"},
			{start: 7, end: 14, nick: "foo_bar"},
			{start: 15, end: 21, nick: "[nick]"},
		]);
	});
});
