import log from "../../../server/log";
import {expect} from "chai";
import TestUtil from "../../util";
import sinon from "ts-sinon";
import packagePlugin from "../../../server/plugins/packages";

let packages: typeof packagePlugin;

describe("packages", function () {
	let logInfoStub: sinon.SinonStub<string[], void>;

	beforeEach(function () {
		logInfoStub = sinon.stub(log, "info");

		delete require.cache[require.resolve("../../../server/plugins/packages")];
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		packages = require("../../../server/plugins/packages").default;
	});

	afterEach(function () {
		logInfoStub.restore();
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
			logInfoStub.restore();
			let stdout = "";
			logInfoStub = sinon
				.stub(log, "info")
				.callsFake(TestUtil.sanitizeLog((str) => (stdout += str)));
			packages.loadPackages();

			expect(stdout).to.deep.equal(
				"Package thelounge-package-foo vdummy loaded\nThere are packages using the experimental plugin API. Be aware that this API is not yet stable and may change in future The Lounge releases.\n"
			);
		});
	});
});
