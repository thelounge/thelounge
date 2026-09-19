import {expect} from "vitest";
import log from "../../server/log";
import Client from "../../server/client";
import TestUtil from "../util";
import sinon from "ts-sinon";

describe("Custom highlights", function () {
	let userLoadedLog = "";
	const logInfoStub = sinon.stub(log, "info");
	logInfoStub.callsFake(TestUtil.sanitizeLog((str) => (userLoadedLog += str)));

	const client = new Client(
		{
			clients: [],
			getDataToSave() {
				return {
					newUser: "",
					newHash: "",
				};
			},
		} as any,
		"test",
		{
			clientSettings: {
				highlights: "foo, @all,   sp ace   , 고",
				highlightExceptions: "foo bar, bar @all, test sp ace test",
			},
		} as any
	);
	client.connect();
	logInfoStub.restore();
	expect(userLoadedLog).to.equal("User test loaded\n");

	it("should NOT highlight", function () {
		const teststrings = [
			"and foos stuff",
			"test foobar",
			"testfoo bar",
			"fooö",
			"wtf@all",
			"space",
			"sp:ace",
		];

		for (const teststring of teststrings) {
			expect(teststring).to.not.match(client.highlightRegex!);
		}
	});

	it("should highlight", function () {
		const teststrings = [
			"Hey foo hello",
			"hey Foo: hi",
			"hey Foo, hi",
			"<foo> testing",
			"foo",
			"hey @all test",
			"testing foo's stuff",
			'"foo"',
			'"@all"',
			"foo!",
			"www.foo.bar",
			"www.bar.foo/page",
			"고",
			"test 고",
			"고!",
			"www.고.com",
			"foo고",
			"test고",
			"오늘고맙다",
			"hey @Foo",
			"hey ~Foo",
			"hey +Foo",
			"hello &foo",
			"@all",
			"@all wtf",
			"wtf @all",
			"@@all",
			"@고",
			"f00 sp ace: bar",
		];

		for (const teststring of teststrings) {
			expect(teststring).to.match(client.highlightRegex!);
		}
	});

	it("should trim highlights and split them by word-boundary support", function () {
		// Tokens whose script uses word boundaries (Latin, etc.) are wrapped in
		// delimiter groups; tokens whose script does not (e.g. Hangul) are matched
		// as a plain substring in a separate alternative.
		expect(client.highlightRegex!.source).to.include("(?:foo|@all|sp ace)");
		expect(client.highlightRegex!.source).to.include("(?:고)");
	});

	it("should NOT compile a regex", function () {
		// test updating the regex and invalid custom hl inputs
		client.config.clientSettings.highlights = ",,";
		client.compileCustomHighlights();
		expect(client.highlightRegex).to.be.null;

		client.config.clientSettings.highlights = "  ";
		client.compileCustomHighlights();
		expect(client.highlightRegex).to.be.null;
	});

	// tests for highlight exceptions
	it("should NOT highlight due to highlight exceptions", function () {
		const teststrings = [
			"foo bar baz",
			"test foo bar",
			"foo bar @all test",
			"with a test sp ace test",
		];

		for (const teststring of teststrings) {
			expect(teststring).to.match(client.highlightExceptionRegex!);
		}
	});

	it("should highlight regardless of highlight exceptions", function () {
		const teststrings = [
			"Hey foo hello",
			"hey Foo: hi",
			"hey Foo, hi",
			"<foo> testing",
			"foo",
			"hey @all test",
			"testing foo's stuff",
			'"foo"',
			'"@all"',
			"foo!",
			"www.foo.bar",
			"www.bar.foo/page",
			"고",
			"test 고",
			"고!",
			"www.고.com",
			"hey @Foo",
			"hey ~Foo",
			"hey +Foo",
			"hello &foo",
			"@all",
			"@all wtf",
			"wtfbar @all",
			"@@all",
			"@고",
			"f00 sp ace: bar",
		];

		for (const teststring of teststrings) {
			expect(teststring).to.not.match(client.highlightExceptionRegex!);
		}
	});
});

describe("Custom highlights with scripts that have no word boundaries", function () {
	const logInfoStub = sinon.stub(log, "info");

	const client = new Client(
		{
			clients: [],
			getDataToSave() {
				return {
					newUser: "",
					newHash: "",
				};
			},
		} as any,
		"test",
		{
			clientSettings: {
				highlights: "foo, 天気, 고",
				highlightExceptions: "고",
			},
		} as any
	);
	client.connect();
	logInfoStub.restore();

	it("should match CJK/Hangul highlights anywhere, without word boundaries", function () {
		const teststrings = [
			"今日はいい天気ですね", // 天気 embedded, no spaces
			"天気",
			"오늘고맙다", // 고 embedded
			"test고",
			"foo고",
		];

		for (const teststring of teststrings) {
			expect(teststring).to.match(client.highlightRegex!);
		}
	});

	it("should still require word boundaries for Latin highlights", function () {
		// "foo" must not match inside "football"/"foobar" just because CJK tokens
		// are present in the same highlight list.
		const teststrings = ["football", "foobar", "testfoo", "barfoo"];

		for (const teststring of teststrings) {
			expect(teststring).to.not.match(client.highlightRegex!);
		}
	});

	it("should highlight Latin tokens that are properly delimited", function () {
		const teststrings = ["foo", "hey foo!", "<foo>"];

		for (const teststring of teststrings) {
			expect(teststring).to.match(client.highlightRegex!);
		}
	});

	it("should NOT highlight strings without any token", function () {
		const teststrings = ["bar", "hello world", "test"];

		for (const teststring of teststrings) {
			expect(teststring).to.not.match(client.highlightRegex!);
		}
	});

	it("should apply substring matching to highlight exceptions too", function () {
		const teststrings = ["오늘고맙다", "test고", "고"];

		for (const teststring of teststrings) {
			expect(teststring).to.match(client.highlightExceptionRegex!);
		}
	});
});
