import {expect} from "chai";
import {findLinks, findLinksWithSchema} from "../../shared/linkify";

describe("findLinks", () => {
	it("should find url", () => {
		const input = "irc://irc.example.com/thelounge";
		const expected = [
			{
				start: 0,
				end: 31,
				link: "irc://irc.example.com/thelounge",
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with www", () => {
		const input = "www.nooooooooooooooo.com";
		const expected = [
			{
				start: 0,
				end: 24,
				link: "http://www.nooooooooooooooo.com",
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls in strings", () => {
		const input = "look at https://thelounge.chat/ for more information";
		const expected = [
			{
				link: "https://thelounge.chat/",
				start: 8,
				end: 31,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls in strings starting with www", () => {
		const input = "use www.duckduckgo.com for privacy reasons";
		const expected = [
			{
				link: "http://www.duckduckgo.com",
				start: 4,
				end: 22,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with odd surroundings", () => {
		const input = "<https://theos.kyriasis.com/~kyrias/stats/archlinux.html>";
		const expected = [
			{
				link: "https://theos.kyriasis.com/~kyrias/stats/archlinux.html",
				start: 1,
				end: 56,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with starting with http:// and odd surroundings", () => {
		const input = ".:http://www.github.com:. .:www.github.com:.";
		const expected = [
			{
				link: "http://www.github.com",
				start: 2,
				end: 23,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find urls", () => {
		const input = "text www. text";
		const expected = [];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should handle multiple www. correctly", () => {
		const input = "www.www.test.com";
		const expected = [
			{
				link: "http://www.www.test.com",
				start: 0,
				end: 16,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find domains without www. but valid tld", () => {
		const input = "google.com google.lv google.museum";
		const expected = [
			{
				link: "http://google.com",
				start: 0,
				end: 10,
			},
			{
				link: "http://google.lv",
				start: 11,
				end: 20,
			},
			{
				link: "http://google.museum",
				start: 21,
				end: 34,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find .onion domains", () => {
		const input = "facebookcorewwwi.onion/test?url";
		const expected = [
			{
				link: "http://facebookcorewwwi.onion/test?url",
				start: 0,
				end: 31,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should not consider invalid TLDs as domains", () => {
		const input = "google.wtfgugl google.xx www.google.wtfgugl www.google.xx";
		const expected = [];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should consider invalid TLDs as domains if protocol is specified", () => {
		const input =
			"http://google.wtfgugl http://google.xx http://www.google.wtfgugl http://www.google.xx";
		const expected = [
			{
				link: "http://google.wtfgugl",
				start: 0,
				end: 21,
			},
			{
				link: "http://google.xx",
				start: 22,
				end: 38,
			},
			{
				link: "http://www.google.wtfgugl",
				start: 39,
				end: 64,
			},
			{
				link: "http://www.google.xx",
				start: 65,
				end: 85,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should correctly stop at punctuation", () => {
		// Issue #2351
		const input =
			"https://en.wikipedia.org/wiki/Dig! " +
			"https://en.wikipedia.org/wiki/Dig? " +
			"https://en.wikipedia.org/wiki/Dig. " +
			"https://www.google.com* " +
			"https://www.google.com/test* " +
			"https://www.google.com@ " +
			"https://www.google.com/test@ " +
			"https://www.google.com! ";
		const expected = [
			{
				link: "https://en.wikipedia.org/wiki/Dig",
				start: 0,
				end: 33,
			},
			{
				link: "https://en.wikipedia.org/wiki/Dig",
				start: 35,
				end: 68,
			},
			{
				link: "https://en.wikipedia.org/wiki/Dig",
				start: 70,
				end: 103,
			},
			{
				link: "https://www.google.com",
				start: 105,
				end: 127,
			},
			{
				link: "https://www.google.com/test*",
				start: 129,
				end: 157,
			},
			{
				link: "https://www.google.com",
				start: 158,
				end: 180,
			},
			{
				link: "https://www.google.com/test@",
				start: 182,
				end: 210,
			},
			{
				link: "https://www.google.com",
				start: 211,
				end: 233,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should correctly stop at apostrophe", () => {
		const input = "https://www.google.com's www.google.com's google.com's"; // Issue #1302
		const expected = [
			{
				link: "https://www.google.com",
				start: 0,
				end: 22,
			},
			{
				link: "http://www.google.com",
				start: 25,
				end: 39,
			},
			{
				link: "http://google.com",
				start: 42,
				end: 52,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("does not find invalid urls", () => {
		const input = "www.example.com ssh://-oProxyCommand=whois"; // Issue #1412
		const expected = [
			{
				start: 0,
				end: 15,
				link: "http://www.example.com",
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);

		const input2 = "www.example.com http://root:'some%pass'@hostname/database"; // Issue #1618
		const expected2 = [
			{
				start: 0,
				end: 15,
				link: "http://www.example.com",
			},
			{
				start: 16,
				end: 57,
				link: "http://root:'some%pass'@hostname/database",
			},
		];

		const actual2 = findLinks(input2);

		expect(actual2).to.deep.equal(expected2);
	});

	it("keeps parsing after finding an invalid url", () => {
		const input = "www.example.com http://a:%p@c http://thelounge.chat";
		const expected = [
			{
				start: 0,
				end: 15,
				link: "http://www.example.com",
			},
			{
				start: 16,
				end: 29,
				link: "http://a:%p@c",
			},
			{
				start: 30,
				end: 51,
				link: "http://thelounge.chat",
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should add protocol to protocol-aware urls", () => {
		const input = "//example.com";
		const expected = [
			{
				link: "http://example.com",
				start: 0,
				end: 13,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should parse mailto links", () => {
		const input = "mail@example.com mailto:mail@example.org";
		const expected = [
			{
				link: "mailto:mail@example.com",
				start: 0,
				end: 16,
			},
			{
				link: "mailto:mail@example.org",
				start: 17,
				end: 40,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should not return urls with no schema if flag is specified", () => {
		const input = "https://example.global //example.com http://example.group example.py";
		const expected = [
			{
				link: "https://example.global",
				start: 0,
				end: 22,
			},
			{
				end: 57,
				link: "http://example.group",
				start: 37,
			},
		];

		const actual = findLinksWithSchema(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should use http for protocol-less URLs", () => {
		const input = "//example.com";
		const expected = [
			{
				link: "http://example.com",
				start: 0,
				end: 13,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find web+ schema urls", () => {
		const input = "web+ap://instance.example/@Example web+whatever://example.com?some=value";
		const expected = [
			{
				link: "web+ap://instance.example/@Example",
				start: 0,
				end: 34,
			},
			{
				link: "web+whatever://example.com?some=value",
				start: 35,
				end: 72,
			},
		];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find web+ schema urls if scheme required flag is specified", () => {
		const input =
			"web+ap://instance.example/@Example web+Whatever://example.com?some=value example.org";
		const expected = [
			{
				link: "web+ap://instance.example/@Example",
				start: 0,
				end: 34,
			},
			{
				link: "web+Whatever://example.com?some=value",
				start: 35,
				end: 72,
			},
		];

		const actual = findLinksWithSchema(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should disregard invalid web+ links", () => {
		const input = "web+://whatever.example";
		const actual = findLinksWithSchema(input);

		expect(actual).to.be.empty;
	});
});
