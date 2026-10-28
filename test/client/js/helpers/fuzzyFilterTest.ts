import {expect} from "vitest";
import fuzzyFilter from "../../../../client/js/helpers/fuzzyFilter";

describe("fuzzyFilter", () => {
	it("wraps matched characters in <b>", () => {
		const actual = fuzzyFilter("ab", ["xaybz", "nope"]);

		expect(actual).to.deep.equal([{string: "x<b>a</b>y<b>b</b>z", original: "xaybz"}]);
	});

	it("escapes html in the rendered string", () => {
		const actual = fuzzyFilter("ab", ["a<b", "a&b", 'a"b']);

		expect(actual.map((r) => r.string)).to.deep.equal([
			"<b>a</b>&lt;<b>b</b>",
			"<b>a</b>&amp;<b>b</b>",
			"<b>a</b>&quot;<b>b</b>",
		]);
	});

	it("keeps the original item and uses the extract function", () => {
		const users = [{nick: "alice"}, {nick: "bob"}];
		const actual = fuzzyFilter("bo", users, (u) => u.nick);

		expect(actual).to.deep.equal([{string: "<b>b</b><b>o</b>b", original: users[1]}]);
	});

	it("returns nothing for an empty list", () => {
		expect(fuzzyFilter("a", [])).to.deep.equal([]);
	});
});
