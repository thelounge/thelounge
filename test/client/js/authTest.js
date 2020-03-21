"use strict";

const expect = require("chai").expect;
const stub = require("sinon").stub;
const Auth = require("../../../client/js/auth").default;
const localStorage = require("../../../client/js/localStorage").default;
const location = require("../../../client/js/location").default;

describe("Auth", function () {
	describe(".signout", function () {
		beforeEach(function () {
			stub(localStorage, "clear");
			stub(location, "reload");
		});

		afterEach(function () {
			localStorage.clear.restore();
			location.reload.restore();
		});

		it("should empty the local storage", function () {
			Auth.signout();
			expect(localStorage.clear.calledOnce).to.be.true;
		});

		it("should reload the page", function () {
			Auth.signout();
			expect(location.reload.calledOnce).to.be.true;
		});
	});
});
