"use strict";

const expect = require("chai").expect;
const stub = require("sinon").stub;
const log = require("../../src/log");
const Client = require("../../src/client");
const TestUtil = require("../util");

describe("Custom highlights", function () {
	let userLoadedLog = "";
	stub(log, "info").callsFake(TestUtil.sanitizeLog((str) => (userLoadedLog += str)));

	const client = new Client(
		{
			clients: [],
			getDataToSave() {
				return {
					newUser: "",
					newHash: "",
				};
			},
		},
		"test",
		{
			clientSettings: {
				highlights: "foo, @all,   sp ace   , 고",
				highlightExceptions: "foo bar, bar @all, test sp ace test",
			},
		}
	);

	log.info.restore();
	expect(userLoadedLog).to.equal("User test loaded\n");

	it("should NOT highlight", function () {
		const teststrings = [
			"and foos stuff",
			"test foobar",
			"testfoo bar",
			"fooö",
			"wtf@all",
			"foo고",
			"test고",
			"space",
			"sp:ace",
		];

		for (const teststring of teststrings) {
			expect(teststring).to.not.match(client.highlightRegex);
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
			expect(teststring).to.match(client.highlightRegex);
		}
	});

	it("should trim custom highlights in the compiled regex", function () {
		expect(client.highlightRegex).to.match(/\(\?:foo\|@all\|sp ace\|고\)/);
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
			expect(teststring).to.match(client.highlightExceptionRegex);
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
			expect(teststring).to.not.match(client.highlightExceptionRegex);
		}
	});
});
