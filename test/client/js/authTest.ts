"use strict";

import {expect} from "chai";
import {stub} from "sinon";
import Auth from "../../../client/js/auth";
import localStorage from "../../../client/js/localStorage";
import location from "../../../client/js/location";

describe("Auth", function () {
	describe(".signout", function () {
		beforeEach(function () {
			stub(localStorage, "clear");
			stub(location, "reload");
		});

		afterEach(function () {
			// @ts-expect- ts-migrate(2339) FIXME: Property 'restore' does not exist on type '() => v... Remove this comment to see the full error message
			localStorage.clear.restore();
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'restore' does not exist on type '{ (): v... Remove this comment to see the full error message
			location.reload.restore();
		});

		it("should empty the local storage", function () {
			Auth.signout();
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'calledOnce' does not exist on type '() =... Remove this comment to see the full error message
			expect(localStorage.clear.calledOnce).to.be.true;
		});

		it("should reload the page", function () {
			Auth.signout();
			// @ts-expect-error ts-migrate(2339) FIXME: Property 'calledOnce' does not exist on type '{ ()... Remove this comment to see the full error message
			expect(location.reload.calledOnce).to.be.true;
		});
	});
});
