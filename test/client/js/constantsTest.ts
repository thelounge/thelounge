"use strict";

const expect = require("chai").expect;
const constants = require("../../../client/js/constants");

describe("client-side constants", function () {
	describe(".colorCodeMap", function () {
		it("should be a non-empty array", function () {
			expect(constants.colorCodeMap).to.be.an("array").of.length(16);
		});

		it("should be made of pairs of strings", function () {
			constants.colorCodeMap.forEach(([code, name]) => {
				expect(code)
					.to.be.a("string")
					.that.match(/[0-9]{2}/);
				expect(name).to.be.a("string");
			});
		});
	});

	describe(".condensedTypes", function () {
		it("should be a non-empty array", function () {
			expect(constants.condensedTypes).to.be.an.instanceof(Set).that.is.not.empty;
		});

		it("should only contain ASCII strings", function () {
			constants.condensedTypes.forEach((type) => {
				expect(type).to.be.a("string").that.does.match(/^\w+$/);
			});
		});
	});

	describe(".timeFormats", function () {
		it("should be objects of strings", function () {
			expect(constants.timeFormats.msgDefault).to.be.an("string").that.is.not.empty;
			expect(constants.timeFormats.msgWithSeconds).to.be.an("string").that.is.not.empty;
		});
	});
});
