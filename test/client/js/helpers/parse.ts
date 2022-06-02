import {expect} from "chai";

import {mount} from "@vue/test-utils";
import ParsedMessage from "../../../../client/components/ParsedMessage.vue";
import {ClientMessage} from "../../../../client/js/types";

function getParsedMessageContents(text: string, message?: any) {
	const wrapper = mount(ParsedMessage, {
		props: {
			text,
			message,
		},
	});

	return wrapper.html();
}

describe("IRC formatted message parser", () => {
	it("should not introduce xss", () => {
		const testCases = [
			{
				input: "<img onerror='location.href=\"//youtube.com\"'>",
				expected:
					'&lt;img onerror=\'location.href="<a href="http://youtube.com" dir="auto" target="_blank" rel="noopener">//youtube.com</a>"\'&gt;',
			},
			{
				input: '#&">bug',
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">#&amp;&quot;&gt;bug</span>',
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should skip all <32 ASCII codes except linefeed", () => {
		const testCases = [
			{
				input: "\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0B\x0C\x0D\x0E\x0F\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1A\x1B\x1C\x1B\x1D\x1D\x1E\x1Ftext\x0Awithcontrolcodestest",
				expected:
					' <span class="irc-bold">         </span> <span class="irc-monospace">           </span><span class="irc-underline irc-strikethrough irc-monospace">text\nwithcontrolcodestest</span>',
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should find urls", () => {
		const testCases = [
			{
				input: "irc://irc.example.com/thelounge",
				expected:
					'<a href="irc://irc.example.com/thelounge" dir="auto" target="_blank" rel="noopener">' +
					"irc://irc.example.com/thelounge" +
					"</a>",
			},
			{
				input: "www.nooooooooooooooo.com",
				expected:
					'<a href="http://www.nooooooooooooooo.com" dir="auto" target="_blank" rel="noopener">' +
					"www.nooooooooooooooo.com" +
					"</a>",
			},
			{
				input: "look at https://thelounge.chat/ for more information",
				expected:
					"look at " +
					'<a href="https://thelounge.chat/" dir="auto" target="_blank" rel="noopener">' +
					"https://thelounge.chat/" +
					"</a>" +
					" for more information",
			},
			{
				input: "use www.duckduckgo.com for privacy reasons",
				expected:
					"use " +
					'<a href="http://www.duckduckgo.com" dir="auto" target="_blank" rel="noopener">' +
					"www.duckduckgo.com" +
					"</a>" +
					" for privacy reasons",
			},
			{
				input: "svn+ssh://example.org",
				expected:
					'<a href="svn+ssh://example.org" dir="auto" target="_blank" rel="noopener">' +
					"svn+ssh://example.org" +
					"</a>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("url with a dot parsed correctly", () => {
		const input =
			"bonuspunkt: your URL parser misparses this URL: https://msdn.microsoft.com/en-us/library/windows/desktop/ms644989(v=vs.85).aspx";
		const correctResult =
			"bonuspunkt: your URL parser misparses this URL: " +
			'<a href="https://msdn.microsoft.com/en-us/library/windows/desktop/ms644989(v=vs.85).aspx" dir="auto" target="_blank" rel="noopener">' +
			"https://msdn.microsoft.com/en-us/library/windows/desktop/ms644989(v=vs.85).aspx" +
			"</a>";

		const actual = getParsedMessageContents(input);

		expect(actual).to.deep.equal(correctResult);
	});

	it("should balance brackets", () => {
		const testCases = [
			{
				input: "<https://theos.kyriasis.com/~kyrias/stats/archlinux.html>",
				expected:
					"&lt;" +
					'<a href="https://theos.kyriasis.com/~kyrias/stats/archlinux.html" dir="auto" target="_blank" rel="noopener">' +
					"https://theos.kyriasis.com/~kyrias/stats/archlinux.html" +
					"</a>" +
					"&gt;",
			},
			{
				input: "abc (www.example.com)",
				expected:
					"abc (" +
					'<a href="http://www.example.com" dir="auto" target="_blank" rel="noopener">' +
					"www.example.com" +
					"</a>" +
					")",
			},
			{
				input: "http://example.com/Test_(Page)",
				expected:
					'<a href="http://example.com/Test_(Page)" dir="auto" target="_blank" rel="noopener">' +
					"http://example.com/Test_(Page)" +
					"</a>",
			},
			{
				input: "www.example.com/Test_(Page)",
				expected:
					'<a href="http://www.example.com/Test_(Page)" dir="auto" target="_blank" rel="noopener">' +
					"www.example.com/Test_(Page)" +
					"</a>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find urls", () => {
		const testCases = [
			{
				input: "text www. text",
				expected: "text www. text",
			},
			{
				input: "http://.",
				expected: "http://.",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should find channels", () => {
		const testCases = [
			{
				input: "#a",
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#a" +
					"</span>",
			},
			{
				input: "#test",
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#test" +
					"</span>",
			},
			{
				input: "#äöü",
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#äöü" +
					"</span>",
			},
			{
				input: "inline #channel text",
				expected:
					"inline " +
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#channel" +
					"</span>" +
					" text",
			},
			{
				input: "#1,000",
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#1,000" +
					"</span>",
			},
			{
				input: "@#a",
				expected:
					"@" +
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#a" +
					"</span>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find channels", () => {
		const testCases = [
			{
				input: "hi#test",
				expected: "hi#test",
			},
			{
				input: "#",
				expected: "#",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	[
		{
			name: "bold",
			input: "\x02bold",
			expected: '<span class="irc-bold">bold</span>',
		},
		{
			name: "foreground color",
			input: "\x038yellowText",
			expected: '<span class="irc-fg8">yellowText</span>',
		},
		{
			name: "foreground and background colors (white)",
			input: "\x030,0white,white",
			expected: '<span class="irc-fg0 irc-bg0">white,white</span>',
		},
		{
			name: "foreground and background colors",
			input: "\x034,8yellowBGredText",
			expected: '<span class="irc-fg4 irc-bg8">yellowBGredText</span>',
		},
		{
			name: "hex foreground color",
			input: "\x04663399rebeccapurple",
			expected: '<span style="color:#663399;">rebeccapurple</span>',
		},
		{
			name: "hex foreground and background colors",
			input: "\x04415364,ff9e18The Lounge",
			expected: '<span style="color:#415364;background-color:#FF9E18;">The Lounge</span>',
		},
		{
			name: "italic",
			input: "\x1ditalic",
			expected: '<span class="irc-italic">italic</span>',
		},
		{
			name: "underline",
			input: "\x1funderline",
			expected: '<span class="irc-underline">underline</span>',
		},
		{
			name: "strikethrough",
			input: "\x1estrikethrough",
			expected: '<span class="irc-strikethrough">strikethrough</span>',
		},
		{
			name: "monospace",
			input: "\x11monospace",
			expected: '<span class="irc-monospace">monospace</span>',
		},
		{
			name: "reverse with foreground and background colors",
			input: "\x0313,1fg and bg \x16and reversed",
			expected:
				'<span class="irc-fg13 irc-bg1">fg and bg </span>' +
				'<span class="irc-fg1 irc-bg13">and reversed</span>',
		},
		{
			name: "toggle reverse with foreground and background colors",
			input: "\x0305,11text \x16reversed and \x16back again and \x16reversed",
			expected:
				'<span class="irc-fg5 irc-bg11">text </span>' +
				'<span class="irc-fg11 irc-bg5">reversed and </span>' +
				'<span class="irc-fg5 irc-bg11">back again and </span>' +
				'<span class="irc-fg11 irc-bg5">reversed</span>',
		},
		{
			name: "escape reverse when new colors are applied",
			input: "\x0311,02text \x16 reversed \x0304,05 and new style",
			expected:
				'<span class="irc-fg11 irc-bg2">text </span>' +
				'<span class="irc-fg2 irc-bg11"> reversed </span>' +
				'<span class="irc-fg4 irc-bg5"> and new style</span>',
		},
		{
			name: "resets",
			input: "\x02bold\x038yellow\x02nonBold\x03default",
			expected:
				'<span class="irc-bold">bold</span>' +
				'<span class="irc-bold irc-fg8">yellow</span>' +
				'<span class="irc-fg8">nonBold</span>' +
				"default",
		},
		{
			name: "duplicates",
			input: "\x02bold\x02 \x02bold\x02",
			expected:
				'<span class="irc-bold">bold</span>' + " " + '<span class="irc-bold">bold</span>',
		},
	].forEach(({name, input, expected}) => {
		it(`should handle style characters: ${name}`, () => {
			expect(getParsedMessageContents(input)).to.equal(expected);
		});
	});

	it("should find nicks", async () => {
		const testCases = [
			{
				message: {
					users: ["MaxLeiter"],
				},
				input: "test, MaxLeiter",
				expected:
					"test, " +
					'<span data-name="MaxLeiter" role="button" dir="auto" class="user color-12">' +
					"MaxLeiter" +
					"</span>",
			},
		];

		const actual = await Promise.all(
			testCases.map((testCase) => getParsedMessageContents(testCase.input, testCase.message))
		);
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find nicks", () => {
		const testCases = [
			{
				users: ["MaxLeiter, test"],
				input: "#test-channelMaxLeiter",
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					"#test-channelMaxLeiter" +
					"</span>",
			},
			{
				users: ["MaxLeiter, test"],
				input: "https://www.MaxLeiter.com/test",
				expected:
					'<a href="https://www.MaxLeiter.com/test" dir="auto" target="_blank" rel="noopener">' +
					"https://www.MaxLeiter.com/test" +
					"</a>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should go bonkers like mirc", () => {
		const testCases = [
			{
				input: "\x02irc\x0f://\x1dirc.example.com\x0f/\x034,8thelounge",
				expected:
					'<a href="irc://irc.example.com/thelounge" dir="auto" target="_blank" rel="noopener">' +
					'<span class="irc-bold">irc</span>' +
					"://" +
					'<span class="irc-italic">irc.example.com</span>' +
					"/" +
					'<span class="irc-fg4 irc-bg8">thelounge</span>' +
					"</a>",
			},
			{
				input: "\x02#\x038,9thelounge",
				expected:
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					'<span class="irc-bold">#</span>' +
					'<span class="irc-bold irc-fg8 irc-bg9">thelounge</span>' +
					"</span>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	// Emoji
	[
		{
			name: "in text",
			input: "Hello💬",
			expected:
				'Hello<span role="img" aria-label="Emoji: speech balloon" title="Emoji: speech balloon" class="emoji">💬</span>',
		},
		{
			name: "complicated zero-join-width emoji",
			input: "🤦🏿‍♀️",
			expected:
				'<span role="img" aria-label="Emoji: woman facepalming" title="Emoji: woman facepalming" class="emoji">🤦🏿‍♀️</span>',
		},
		{
			name: "unicode 12 emojis",
			input: "🧘🏿👨‍👨‍👧‍👧",
			expected:
				'<span role="img" aria-label="Emoji: person in lotus position" title="Emoji: person in lotus position" class="emoji">🧘🏿</span><span role="img" aria-label="Emoji: family: man, man, girl, girl" title="Emoji: family: man, man, girl, girl" class="emoji">👨‍👨‍👧‍👧</span>',
		},
		{
			name: "unicode 12 emojis with multiple modifiers",
			input: "👩🏾‍🤝‍👨🏽",
			expected: '<span role="img" class="emoji">👩🏾‍🤝‍👨🏽</span>',
		},
		{
			name: "with modifiers",
			input: "🤷‍♀️",
			expected:
				'<span role="img" aria-label="Emoji: woman shrugging" title="Emoji: woman shrugging" class="emoji">🤷‍♀️</span>',
		},
		{
			name: "with emoji variant selector",
			input: "\u{2695}\u{FE0F}",
			expected:
				'<span role="img" aria-label="Emoji: medical symbol" title="Emoji: medical symbol" class="emoji">\u{2695}\u{FE0F}</span>',
		},
		{
			name: "with text variant selector",
			input: "\u{2695}\u{FE0E}",
			expected: "\u{2695}\u{FE0E}", // this does not match because FE0E is specifically a text variant
		},
		{
			name: "without variant selector",
			input: "\u{2695}",
			expected: "\u{2695}", // this does not match because emoji-regex expects \uFE0F as per the emoji specification
		},
		{
			// FIXME: These multiple `span`s should be optimized into a single one. See https://github.com/thelounge/thelounge/issues/1783
			name: "wrapped in style",
			input: "Super \x034💚 green!",
			expected:
				'Super <span role="img" aria-label="Emoji: green heart" title="Emoji: green heart" class="emoji"><span class="irc-fg4">💚</span></span><span class="irc-fg4"> green!</span>',
		},
		{
			name: "wrapped in URLs",
			input: "https://i.❤️.thelounge.chat",
			// FIXME: Emoji in text should be `<span class="emoji">❤️</span>`. See https://github.com/thelounge/thelounge/issues/1784
			expected:
				'<a href="https://i.❤️.thelounge.chat" dir="auto" target="_blank" rel="noopener">https://i.❤️.thelounge.chat</a>',
		},
		{
			name: "wrapped in channels",
			input: "#i❤️thelounge",
			// FIXME: Emoji in text should be `<span class="emoji">❤️</span>`. See https://github.com/thelounge/thelounge/issues/1784
			expected:
				'<span dir="auto" role="button" tabindex="0" class="inline-channel">#i❤️thelounge</span>',
		},
	].forEach(({name, input, expected}) => {
		it(`should find emoji: ${name}`, () => {
			expect(getParsedMessageContents(input)).to.equal(expected);
		});
	});

	it("should optimize generated html", () => {
		const testCases = [
			{
				input: 'test \x0312#\x0312\x0312"te\x0312st\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312\x0312a',
				expected:
					"test " +
					'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
					'<span class="irc-fg12">#&quot;testa</span>' +
					"</span>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should trim common protocols", () => {
		const testCases = [
			{
				input: "like..http://example.com",
				expected:
					"like.." +
					'<a href="http://example.com" dir="auto" target="_blank" rel="noopener">' +
					"http://example.com" +
					"</a>",
			},
			{
				input: "like..HTTP://example.com",
				expected:
					"like.." +
					'<a href="HTTP://example.com" dir="auto" target="_blank" rel="noopener">' +
					"HTTP://example.com" +
					"</a>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not find channel in fragment", () => {
		const testCases = [
			{
				input: "http://example.com/#hash",
				expected:
					'<a href="http://example.com/#hash" dir="auto" target="_blank" rel="noopener">' +
					"http://example.com/#hash" +
					"</a>",
			},
		];

		const actual = testCases.map((testCase) => getParsedMessageContents(testCase.input));
		const expected = testCases.map((testCase) => testCase.expected);

		expect(actual).to.deep.equal(expected);
	});

	it("should not overlap parts", () => {
		const input = "Url: http://example.com/path Channel: ##channel";
		const actual = getParsedMessageContents(input);

		expect(actual).to.equal(
			'Url: <a href="http://example.com/path" dir="auto" target="_blank" rel="noopener">http://example.com/path</a> ' +
				'Channel: <span dir="auto" role="button" tabindex="0" class="inline-channel">##channel</span>'
		);
	});

	it("should handle overlapping parts by using first starting", () => {
		const input = "#test-https://example.com";
		const actual = getParsedMessageContents(input);

		expect(actual).to.equal(
			'<span dir="auto" role="button" tabindex="0" class="inline-channel">' +
				"#test-https://example.com" +
				"</span>"
		);
	});

	it("should find links separated by tab character", () => {
		const input = "example.com\texample.org";
		const actual = getParsedMessageContents(input);

		expect(actual).to.equal(
			'<a href="http://example.com" dir="auto" target="_blank" rel="noopener">example.com</a>' +
				' <a href="http://example.org" dir="auto" target="_blank" rel="noopener">example.org</a>'
		);
	});
});
