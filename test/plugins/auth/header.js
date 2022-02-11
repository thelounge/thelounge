"use strict";

const log = require("../../../src/log");
const headerAuth = require("../../../src/plugins/auth/header");
const Helper = require("../../../src/helper");
const expect = require("chai").expect;
const stub = require("sinon").stub;

const user = "toby";
const correctHeader = "proxy-user";

function testHeaderAuth() {
	// Create mock manager and client. When client is true, manager should not
	// be used. But ideally the auth plugin should not use any of those.
	const manager = {};
	const client = true;

	it("should successfully authenticate with any user passed", function (done) {
		headerAuth.auth(manager, client, user, null, function (valid) {
			expect(valid).to.equal(true);
			done();
		});
	});
}

describe("Header authentication plugin", function () {
	before(function () {
		stub(log, "info");
	});

	after(function () {
		log.info.restore();
	});

	beforeEach(function () {
		Helper.config.public = false;
		Helper.config.headerAuth.enable = true;
		Helper.config.headerAuth.header = correctHeader;
	});

	afterEach(function () {
		Helper.config.public = true;
		Helper.config.headerAuth.enable = false;
	});

	describe("Header authentication availibility", function () {
		it("checks that the configuration is correctly tied to isEnabled()", function () {
			Helper.config.headerAuth.enable = false;
			expect(headerAuth.isEnabled()).to.equal(false);

			Helper.config.headerAuth.enable = true;
			expect(headerAuth.isEnabled()).to.equal(true);
		});
	});

	describe("Header authentication internal user test", function () {
		testHeaderAuth();
	});
});
