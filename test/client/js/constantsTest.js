"use strict";

const expect = require("chai").expect;
const constants = require("../../../client/js/constants");

describe("client-side constants", function() {
	describe(".colorCodeMap", function() {
		it("should be a non-empty array", function() {
			expect(constants.colorCodeMap).to.be.an("array").of.length(16);
		});

		it("should be made of pairs of strings", function() {
			constants.colorCodeMap.forEach((tuple) => { // TODO: In Node v6+, use `[code, name]`
				expect(tuple[0]).to.be.a("string").that.match(/[0-9]{2}/);
				expect(tuple[1]).to.be.a("string");
			});
		});
	});

	describe(".commands", function() {
		it("should be a non-empty array", function() {
			expect(constants.commands).to.be.an("array").that.is.not.empty;
		});

		it("should only contain strings with no whitespaces and starting with /", function() {
			constants.commands.forEach((command) => {
				expect(command).to.be.a("string").that.does.not.match(/\s/);
				expect(command[0]).to.equal("/");
			});
		});
	});

	describe(".condensedTypes", function() {
		it("should be a non-empty array", function() {
			expect(constants.condensedTypes).to.be.an("array").that.is.not.empty;
		});

		it("should only contain ASCII strings", function() {
			constants.condensedTypes.forEach((type) => {
				expect(type).to.be.a("string").that.does.match(/^\w+$/);
			});
		});
	});

	describe(".timeFormats", function() {
		it("should be objects of strings", function() {
			expect(constants.timeFormats.msgDefault).to.be.an("string").that.is.not.empty;
			expect(constants.timeFormats.msgWithSeconds).to.be.an("string").that.is.not.empty;
		});
	});
});
