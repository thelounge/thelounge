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
			link: "http://www.nooooooooooooooo.com"
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls in strings", () => {
		const input = "look at https://thelounge.github.io/ for more information";
		const expected = [{
			link: "https://thelounge.github.io/",
			start: 8,
			end: 36
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls in strings starting with www", () => {
		const input = "use www.duckduckgo.com for privacy reasons";
		const expected = [{
			link: "http://www.duckduckgo.com",
			start: 4,
			end: 22
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with odd surroundings", () => {
		const input = "<https://theos.kyriasis.com/~kyrias/stats/archlinux.html>";
		const expected = [{
			link: "https://theos.kyriasis.com/~kyrias/stats/archlinux.html",
			start: 1,
			end: 56
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls with starting with www. and odd surroundings", () => {
		const input = ".:www.github.com:.";
		const expected = [{
			link: "http://www.github.com",
			start: 2,
			end: 16
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
			end: 16
		}];

		const actual = findLinks(input);

		expect(actual).to.deep.equal(expected);
	});
});
