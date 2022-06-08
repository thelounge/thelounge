import log from "../../../server/log";
import {expect} from "chai";
import TestUtil from "../../util";
import Utils from "../../../server/command-line/utils";
import sinon from "ts-sinon";

describe("Utils", function () {
	describe(".extraHelp", function () {
		it("should start and end with empty lines to display correctly with --help", function () {
			// Mock `log.raw` to extract its effect into an array
			const stdout: string[] = [];
			const logRawStub = sinon
				.stub(log, "raw")
				.callsFake(TestUtil.sanitizeLog((str) => stdout.push(str)));

			Utils.extraHelp();

			logRawStub.restore();

			// Starts with 1 empty line
			expect(stdout[0]).to.equal("\n");
			expect(stdout[1]).to.not.equal("\n");

			// Ends with 1 empty line
			expect(stdout[stdout.length - 2]).to.not.equal("\n");
			expect(stdout[stdout.length - 1]).to.equal("\n");
		});

		it("should contain information about THELOUNGE_HOME env var", function () {
			// Mock `log.raw` to extract its effect into a concatenated string
			let stdout = "";

			const logRawStub = sinon
				.stub(log, "raw")
				.callsFake(TestUtil.sanitizeLog((str) => (stdout += str)));

			Utils.extraHelp();

			logRawStub.restore();

			expect(stdout).to.include("THELOUNGE_HOME");
		});
	});

	describe(".parseConfigOptions", function () {
		describe("when it's the first option given", function () {
			it("should return nothing when passed an invalid config", function () {
				expect(Utils.parseConfigOptions("foo")).to.be.undefined;
			});

			it("should correctly parse boolean values", function () {
				expect(Utils.parseConfigOptions("foo=true")).to.deep.equal({foo: true});
				expect(Utils.parseConfigOptions("foo=false")).to.deep.equal({foo: false});
			});

			it("should correctly parse empty strings", function () {
				expect(Utils.parseConfigOptions("foo=")).to.deep.equal({foo: ""});
				expect(Utils.parseConfigOptions("foo= ")).to.deep.equal({foo: " "});
			});

			it("should correctly parse null values", function () {
				expect(Utils.parseConfigOptions("foo=null")).to.deep.equal({foo: null});
			});

			it("should correctly parse undefined values", function () {
				expect(Utils.parseConfigOptions("foo=undefined")).to.deep.equal({foo: undefined});
			});

			it("should correctly parse array values", function () {
				expect(Utils.parseConfigOptions("foo=[bar,true]")).to.deep.equal({
					foo: ["bar", true],
				});

				expect(Utils.parseConfigOptions("foo=[bar, true]")).to.deep.equal({
					foo: ["bar", true],
				});
			});

			it("should correctly parse empty array values", function () {
				expect(Utils.parseConfigOptions("foo=[]")).to.deep.equal({foo: []});
			});

			it("should correctly parse values that contain `=` sign", function () {
				expect(Utils.parseConfigOptions("foo=bar=42")).to.deep.equal({foo: "bar=42"});
			});

			it("should correctly parse keys using dot-notation", function () {
				expect(Utils.parseConfigOptions("foo.bar=value")).to.deep.equal({
					foo: {bar: "value"},
				});
			});

			it("should correctly parse keys using array-notation", function () {
				expect(Utils.parseConfigOptions("foo[0]=value")).to.deep.equal({foo: ["value"]});
			});

			it("should correctly change type to number", function () {
				expect(Utils.parseConfigOptions("foo=1337")).to.deep.equal({foo: 1337});
				expect(Utils.parseConfigOptions("foo=5")).to.deep.equal({foo: 5});
				expect(Utils.parseConfigOptions("foo=0")).to.deep.equal({foo: 0});
				expect(Utils.parseConfigOptions("foo=9876543210")).to.deep.equal({foo: 9876543210});
				expect(Utils.parseConfigOptions("foo=0987654321")).to.deep.equal({foo: 987654321});
				expect(Utils.parseConfigOptions("foo=-1")).to.deep.equal({foo: -1});
				expect(Utils.parseConfigOptions("foo=-0")).to.deep.equal({foo: -0});
			});
		});

		describe("when some options have already been parsed", function () {
			it("should not modify existing options when passed an invalid config", function () {
				const memo = {foo: "bar"};
				expect(Utils.parseConfigOptions("foo", memo)).to.equal(memo);
			});

			it("should combine a new option with previously parsed ones", function () {
				expect(Utils.parseConfigOptions("bar=false", {foo: true})).to.deep.equal({
					foo: true,
					bar: false,
				});
			});

			it("should maintain existing properties of a nested object", function () {
				expect(Utils.parseConfigOptions("foo.bar=true", {foo: {baz: false}})).to.deep.equal(
					{foo: {bar: true, baz: false}}
				);
			});

			it("should maintain existing entries of an array", function () {
				expect(Utils.parseConfigOptions("foo[1]=baz", {foo: ["bar"]})).to.deep.equal({
					foo: ["bar", "baz"],
				});
			});

			describe("when given the same key multiple times", function () {
				it("should not override options", function () {
					const logWarnStub = sinon.stub(log, "warn");

					const parsed = Utils.parseConfigOptions("foo=baz", {foo: "bar"});

					logWarnStub.restore();

					expect(parsed).to.deep.equal({
						foo: "bar",
					});
				});

				it("should display a warning", function () {
					let warning = "";
					const logWarnStub = sinon
						.stub(log, "warn")
						.callsFake(TestUtil.sanitizeLog((str) => (warning += str)));

					Utils.parseConfigOptions("foo=bar", {foo: "baz"});

					logWarnStub.restore();

					expect(warning).to.include("foo was already specified");
				});
			});
		});
	});
});
