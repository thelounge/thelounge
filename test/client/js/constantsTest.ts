import {expect} from "chai";
import constants from "../../../client/js/constants";
import {describe} from "mocha";

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

	describe(".timeFormats", function () {
		it("should be objects of strings", function () {
			expect(constants.timeFormats.msgDefault).to.be.an("string").that.is.not.empty;
			expect(constants.timeFormats.msgWithSeconds).to.be.an("string").that.is.not.empty;
		});
	});
});
