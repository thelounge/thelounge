"use strict";

const expect = require("chai").expect;
const findLinks = require("../../../../../../client/js/libs/handlebars/ircmessageparser/findLinks");

describe("findLinks", () => {
	it("should find url", () => {
		const input = "irc://freenode.net/thelounge";
		const expected = [{
			start: 0,
			end: 28,
			link: "irc://freenode.net/thelounge",
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with www", () => {
		const input = "www.nooooooooooooooo.com";
		const expected = [{
			start: 0,
			end: 24,
			link: "http://www.nooooooooooooooo.com",
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls in strings", () => {
		const input = "look at https://thelounge.chat/ for more information";
		const expected = [{
			link: "https://thelounge.chat/",
			start: 8,
			end: 31,
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls in strings starting with www", () => {
		const input = "use www.duckduckgo.com for privacy reasons";
		const expected = [{
			link: "http://www.duckduckgo.com",
			start: 4,
			end: 22,
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with odd surroundings", () => {
		const input = "<https://theos.kyriasis.com/~kyrias/stats/archlinux.html>";
		const expected = [{
			link: "https://theos.kyriasis.com/~kyrias/stats/archlinux.html",
			start: 1,
			end: 56,
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with starting with www. and odd surroundings", () => {
		const input = ".:www.github.com:.";
		const expected = [{
			link: "http://www.github.com",
			start: 2,
			end: 16,
		}];

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
		const expected = [{
			link: "http://www.www.test.com",
			start: 0,
			end: 16,
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("does not find invalid urls", () => {
		const input = "www.example.com ssh://-oProxyCommand=whois"; // Issue #1412
		const expected = [{
			start: 0,
			end: 15,
			link: "http://www.example.com",
		}, {
			end: 42,
			start: 16,
			link: "ssh://-oProxyCommand=whois",
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);

		const input2 = "www.example.com http://root:'some%pass'@hostname/database"; // Issue #1618
		const expected2 = [{
			start: 0,
			end: 15,
			link: "http://www.example.com",
		}];

		const actual2 = findLinks(input2);

		expect(actual2).to.deep.equal(expected2);
	});

	it("keeps parsing after finding an invalid url", () => {
		const input = "www.example.com http://a:%p@c http://thelounge.chat";
		const expected = [{
			start: 0,
			end: 15,
			link: "http://www.example.com",
		}, {
			start: 30,
			end: 51,
			link: "http://thelounge.chat",
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});
});
