import {expect} from "chai";
import sinon from "ts-sinon";
import Auth from "../../../client/js/auth";
import localStorage from "../../../client/js/localStorage";
import location from "../../../client/js/location";

describe("Auth", function () {
	describe(".signout", function () {
		let localStorageClearStub: sinon.SinonStub<[], void>;
		let locationReloadStub: sinon.SinonStub<[], void>;

		beforeEach(function () {
			localStorageClearStub = sinon.stub(localStorage, "clear");
			locationReloadStub = sinon.stub(location, "reload");
		});

		afterEach(function () {
			localStorageClearStub.restore();
			locationReloadStub.restore();
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
