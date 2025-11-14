import {expect} from "chai";
import sinon from "sinon";
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
			expect(localStorageClearStub.calledOnce).to.equal(true);
		});

		it("should reload the page", function () {
			Auth.signout();
			expect(locationReloadStub.calledOnce).to.equal(true);
		});
	});
});
