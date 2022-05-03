"use strict";

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'expect'.
const expect = require("chai").expect;
const stub = require("sinon").stub;
const Auth = require("../../../client/js/auth").default;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'localStora... Remove this comment to see the full error message
const localStorage = require("../../../client/js/localStorage").default;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'location'.
const location = require("../../../client/js/location").default;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe("Auth", function () {
	// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
	describe(".signout", function () {
		// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
		beforeEach(function () {
			stub(localStorage, "clear");
			stub(location, "reload");
		});

		// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'afterEach'.
		afterEach(function () {
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'restore' does not exist on type '() => v... Remove this comment to see the full error message
			localStorage.clear.restore();
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'restore' does not exist on type '{ (): v... Remove this comment to see the full error message
			location.reload.restore();
		});

		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should empty the local storage", function () {
			Auth.signout();
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'calledOnce' does not exist on type '() =... Remove this comment to see the full error message
			expect(localStorage.clear.calledOnce).to.be.true;
		});

		// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
		it("should reload the page", function () {
			Auth.signout();
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'calledOnce' does not exist on type '{ ()... Remove this comment to see the full error message
			expect(location.reload.calledOnce).to.be.true;
		});
	});
});
