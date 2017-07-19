"use strict";

const expect = require("chai").expect;
const parse = require("../../../../../client/js/libs/handlebars/parse");

describe("parse Handlebars helper", () => {
	it("should not introduce xss", () => {
		const testCases = [{
			input: "<img onerror='location.href=\"//youtube.com\"'>",
			expected: "&lt;img onerror&#x3D;&#x27;location.href&#x3D;&quot;//youtube.com&quot;&#x27;&gt;"
		}, {
			input: "#&\">bug",
			expected: "<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#&amp;&quot;&gt;bug\">#&amp;&quot;&gt;bug</span>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should skip control codes", () => {
		const testCases = [{
			input: "text\x01with\x04control\x05codes",
			expected: "textwithcontrolcodes"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls", () => {
		const testCases = [{
			input: "irc://freenode.net/thelounge",
			expected:
				"<a href=\"irc://freenode.net/thelounge\" target=\"_blank\" rel=\"noopener\">" +
					"irc://freenode.net/thelounge" +
				"</a>"
		}, {
			input: "www.nooooooooooooooo.com",
			expected:
				"<a href=\"http://www.nooooooooooooooo.com\" target=\"_blank\" rel=\"noopener\">" +
					"www.nooooooooooooooo.com" +
				"</a>"
		}, {
			input: "look at https://thelounge.github.io/ for more information",
			expected:
				"look at " +
				"<a href=\"https://thelounge.github.io/\" target=\"_blank\" rel=\"noopener\">" +
					"https://thelounge.github.io/" +
				"</a>" +
				" for more information"
		}, {
			input: "use www.duckduckgo.com for privacy reasons",
			expected:
				"use " +
				"<a href=\"http://www.duckduckgo.com\" target=\"_blank\" rel=\"noopener\">" +
					"www.duckduckgo.com" +
				"</a>" +
				" for privacy reasons"
		}, {
			input: "svn+ssh://example.org",
			expected:
				"<a href=\"svn+ssh://example.org\" target=\"_blank\" rel=\"noopener\">" +
					"svn+ssh://example.org" +
				"</a>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("url with a dot parsed correctly", () => {
		const input =
			"bonuspunkt: your URL parser misparses this URL: https://msdn.microsoft.com/en-us/library/windows/desktop/ms644989(v=vs.85).aspx";
		const correctResult =
				"bonuspunkt: your URL parser misparses this URL: " +
				"<a href=\"https://msdn.microsoft.com/en-us/library/windows/desktop/ms644989(v&#x3D;vs.85).aspx\" target=\"_blank\" rel=\"noopener\">" +
					"https://msdn.microsoft.com/en-us/library/windows/desktop/ms644989(v&#x3D;vs.85).aspx" +
				"</a>";

		const actual = parse(input);

		expect(actual).to.deep.equal(correctResult);
	});

	it("should balance brackets", () => {
		const testCases = [{
			input: "<https://theos.kyriasis.com/~kyrias/stats/archlinux.html>",
			expected:
				"&lt;" +
				"<a href=\"https://theos.kyriasis.com/~kyrias/stats/archlinux.html\" target=\"_blank\" rel=\"noopener\">" +
					"https://theos.kyriasis.com/~kyrias/stats/archlinux.html" +
				"</a>" +
				"&gt;"
		}, {
			input: "abc (www.example.com)",
			expected:
				"abc (" +
				"<a href=\"http://www.example.com\" target=\"_blank\" rel=\"noopener\">" +
					"www.example.com" +
				"</a>" +
				")"
		}, {
			input: "http://example.com/Test_(Page)",
			expected:
				"<a href=\"http://example.com/Test_(Page)\" target=\"_blank\" rel=\"noopener\">" +
					"http://example.com/Test_(Page)" +
				"</a>"
		}, {
			input: "www.example.com/Test_(Page)",
			expected:
				"<a href=\"http://www.example.com/Test_(Page)\" target=\"_blank\" rel=\"noopener\">" +
					"www.example.com/Test_(Page)" +
				"</a>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find urls", () => {
		const testCases = [{
			input: "text www. text",
			expected: "text www. text"
		}, {
			input: "http://.",
			expected: "http://."
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should find channels", () => {
		const testCases = [{
			input: "#a",
			expected:
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#a\">" +
					"#a" +
				"</span>"
		}, {
			input: "#test",
			expected:
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#test\">" +
					"#test" +
				"</span>"
		}, {
			input: "#äöü",
			expected:
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#äöü\">" +
					"#äöü" +
				"</span>"
		}, {
			input: "inline #channel text",
			expected:
				"inline " +
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#channel\">" +
					"#channel" +
				"</span>" +
				" text"
		}, {
			input: "#1,000",
			expected:
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#1,000\">" +
					"#1,000" +
				"</span>"
		}, {
			input: "@#a",
			expected:
				"@" +
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#a\">" +
					"#a" +
				"</span>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find channels", () => {
		const testCases = [{
			input: "hi#test",
			expected: "hi#test"
		}, {
			input: "#",
			expected: "#"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should style like mirc", () => {
		const testCases = [{
			input: "\x02bold",
			expected: "<span class=\"irc-bold\">bold</span>"
		}, {
			input: "\x038yellowText",
			expected: "<span class=\"irc-fg8\">yellowText</span>"
		}, {
			input: "\x030,0white,white",
			expected: "<span class=\"irc-fg0 irc-bg0\">white,white</span>"
		}, {
			input: "\x034,8yellowBGredText",
			expected: "<span class=\"irc-fg4 irc-bg8\">yellowBGredText</span>"
		}, {
			input: "\x1ditalic",
			expected: "<span class=\"irc-italic\">italic</span>"
		}, {
			input: "\x1funderline",
			expected: "<span class=\"irc-underline\">underline</span>"
		}, {
			input: "\x02bold\x038yellow\x02nonBold\x03default",
			expected:
				"<span class=\"irc-bold\">bold</span>" +
				"<span class=\"irc-bold irc-fg8\">yellow</span>" +
				"<span class=\"irc-fg8\">nonBold</span>" +
				"default"
		}, {
			input: "\x02bold\x02 \x02bold\x02",
			expected:
				"<span class=\"irc-bold\">bold</span>" +
				" " +
				"<span class=\"irc-bold\">bold</span>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should go bonkers like mirc", () => {
		const testCases = [{
			input: "\x02irc\x0f://\x1dfreenode.net\x0f/\x034,8thelounge",
			expected:
				"<a href=\"irc://freenode.net/thelounge\" target=\"_blank\" rel=\"noopener\">" +
					"<span class=\"irc-bold\">irc</span>" +
					"://" +
					"<span class=\"irc-italic\">freenode.net</span>" +
					"/" +
					"<span class=\"irc-fg4 irc-bg8\">thelounge</span>" +
				"</a>"
		}, {
			input: "\x02#\x038,9thelounge",
			expected:
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#thelounge\">" +
					"<span class=\"irc-bold\">#</span>" +
					"<span class=\"irc-bold irc-fg8 irc-bg9\">thelounge</span>" +
				"</span>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should optimize generated html", () => {
		const testCases = [{
			input: "test \x0312#\x0312\x0312\"te\x0312st\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312a",
			expected:
			"test " +
				"<span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"#&quot;testa\">" +
				"<span class=\"irc-fg12\">#&quot;testa</span>" +
			"</span>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should trim commom protocols", () => {
		const testCases = [{
			input: "like..http://example.com",
			expected:
				"like.." +
				"<a href=\"http://example.com\" target=\"_blank\" rel=\"noopener\">" +
					"http://example.com" +
				"</a>"
		}, {
			input: "like..HTTP://example.com",
			expected:
				"like.." +
				"<a href=\"HTTP://example.com\" target=\"_blank\" rel=\"noopener\">" +
					"HTTP://example.com" +
				"</a>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find channel in fragment", () => {
		const testCases = [{
			input: "http://example.com/#hash",
			expected:
				"" +
				"<a href=\"http://example.com/#hash\" target=\"_blank\" rel=\"noopener\">" +
					"http://example.com/#hash" +
				"</a>"
		}];

		const actual = testCases.map((testCase) => parse(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not overlap parts", () => {
		const input = "Url: http://example.com/path Channel: ##channel";
		const actual = parse(input);

		expect(actual).to.equal(
			"Url: <a href=\"http://example.com/path\" target=\"_blank\" rel=\"noopener\">http://example.com/path</a> " +
			"Channel: <span class=\"inline-channel\" role=\"button\" tabindex=\"0\" data-chan=\"##channel\">##channel</span>"
		);
	});
});
