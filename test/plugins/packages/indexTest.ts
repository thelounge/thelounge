"use strict";

const log = require("../../../src/log");
const expect = require("chai").expect;
const stub = require("sinon").stub;
const TestUtil = require("../../util");

let packages;

describe("packages", function () {
	beforeEach(function () {
		stub(log, "info");

		delete require.cache[require.resolve("../../../src/plugins/packages")];
		packages = require("../../../src/plugins/packages");
	});

	afterEach(function () {
		log.info.restore();
	});

	describe(".getStylesheets", function () {
		it("should contain no stylesheets before packages are loaded", function () {
			expect(packages.getStylesheets()).to.be.empty;
		});

		it("should return the list of registered stylesheets for loaded packages", function () {
			packages.loadPackages();

			expect(packages.getStylesheets()).to.deep.equal(["thelounge-package-foo/style.css"]);
		});
	});

	describe(".getPackage", function () {
		it("should contain no reference to packages before loading them", function () {
			expect(packages.getPackage("thelounge-package-foo")).to.be.undefined;
		});

		it("should return details of a registered package after it was loaded", function () {
			packages.loadPackages();

			expect(packages.getPackage("thelounge-package-foo")).to.have.key("onServerStart");
		});
	});

	describe(".loadPackages", function () {
		it("should display report about loading packages", function () {
			// Mock `log.info` to extract its effect into a string
			log.info.restore();
			let stdout = "";
			stub(log, "info").callsFake(TestUtil.sanitizeLog((str) => (stdout += str)));

			packages.loadPackages();

			expect(stdout).to.deep.equal(
				"Package thelounge-package-foo vdummy loaded\nThere are packages using the experimental plugin API. Be aware that this API is not yet stable and may change in future The Lounge releases.\n"
			);
		});
	});
});
