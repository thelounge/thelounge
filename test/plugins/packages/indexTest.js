"use strict";

const {expect} = require("chai");
const TestUtil = require("../../util");

let packages;

describe("packages", function() {
	let originalLogInfo;

	beforeEach(function() {
		originalLogInfo = log.info;
		log.info = () => {};

		delete require.cache[require.resolve("../../../src/plugins/packages")];
		packages = require("../../../src/plugins/packages");
	});

	afterEach(function() {
		log.info = originalLogInfo;
	});

	describe(".getStylesheets", function() {
		it("should contain no stylesheets before packages are loaded", function() {
			expect(packages.getStylesheets()).to.be.empty;
		});

		it("should return the list of registered stylesheets for loaded packages", function() {
			packages.loadPackages();

			expect(packages.getStylesheets()).to.deep.equal([
				"thelounge-package-foo/style.css",
			]);
		});
	});

	describe(".getPackage", function() {
		it("should contain no reference to packages before loading them", function() {
			expect(packages.getPackage("thelounge-package-foo")).to.be.undefined;
		});

		it("should return details of a registered package after it was loaded", function() {
			packages.loadPackages();

			expect(packages.getPackage("thelounge-package-foo"))
				.to.have.key("onServerStart");
		});
	});

	describe(".loadPackages", function() {
		it("should display report about loading packages", function() {
			// Mock `log.info` to extract its effect into a string
			let stdout = "";
			log.info = TestUtil.mockLogger((str) => stdout += str);

			packages.loadPackages();

			expect(stdout).to.deep.equal("Package thelounge-package-foo loaded\n");
		});
	});
});
