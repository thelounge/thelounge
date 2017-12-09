"use strict";

const expect = require("chai").expect;
const TestUtil = require("../../util");
const Utils = require("../../../src/command-line/utils");

describe("Utils", function() {
	describe(".extraHelp", function() {
		let originalRaw;

		beforeEach(function() {
			originalRaw = log.raw;
		});

		afterEach(function() {
			log.raw = originalRaw;
		});

		it("should start and end with empty lines to display correctly with --help", function() {
			// Mock `log.raw` to extract its effect into an array
			const stdout = [];
			log.raw = TestUtil.mockLogger((str) => stdout.push(str));

			Utils.extraHelp();

			// Starts with 2 empty lines
			expect(stdout[0]).to.equal("\n");
			expect(stdout[1]).to.equal("\n");
			expect(stdout[2]).to.not.equal("\n");

			// Ends with 1 empty line
			expect(stdout[stdout.length - 2]).to.not.equal("\n");
			expect(stdout[stdout.length - 1]).to.equal("\n");
		});

		it("should contain information about THELOUNGE_HOME env var", function() {
			// Mock `log.raw` to extract its effect into a concatenated string
			let stdout = "";
			log.raw = TestUtil.mockLogger((str) => stdout += str);

			Utils.extraHelp();

			expect(stdout).to.include("THELOUNGE_HOME");
		});
	});
});
