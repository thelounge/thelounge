"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const constants = require("../../../client/js/constants");

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("client-side constants", function () {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
	describe(".colorCodeMap", function () {
		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should be a non-empty array", function () {
			expect(constants.colorCodeMap).to.be.an("array").of.length(16);
		});

		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should be made of pairs of strings", function () {
			// @ts-expect-error ts-migrate(7031) FIXME: Binding element 'code' implicitly has an 'any' typ... Remove this comment to see the full error message
			constants.colorCodeMap.forEach(([code, name]) => {
				expect(code)
					.to.be.a("string")
					.that.match(/[0-9]{2}/);
				expect(name).to.be.a("string");
			});
		});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
	describe(".condensedTypes", function () {
		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should be a non-empty array", function () {
			expect(constants.condensedTypes).to.be.an.instanceof(Set).that.is.not.empty;
		});

		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should only contain ASCII strings", function () {
			// @ts-expect-error ts-migrate(7006) FIXME: Parameter 'type' implicitly has an 'any' type.
			constants.condensedTypes.forEach((type) => {
				expect(type).to.be.a("string").that.does.match(/^\w+$/);
			});
		});
	});

	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
	describe(".timeFormats", function () {
		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should be objects of strings", function () {
			expect(constants.timeFormats.msgDefault).to.be.an("string").that.is.not.empty;
			expect(constants.timeFormats.msgWithSeconds).to.be.an("string").that.is.not.empty;
		});
	});
});
