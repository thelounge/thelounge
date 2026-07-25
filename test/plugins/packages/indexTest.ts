import path from "path";
import log from "../../../server/log";
import {expect, vi} from "vitest";
import TestUtil from "../../util";
import sinon from "ts-sinon";
import Config from "../../../server/config";

type PackagesModule = typeof import("../../../server/plugins/packages").default;

let packages: PackagesModule;

describe("packages", function () {
	let logInfoStub: sinon.SinonStub<string[], void>;

	beforeEach(async function () {
		logInfoStub = sinon.stub(log, "info");

		// Reset modules to get fresh packages state, then re-setup Config
		vi.resetModules();

		// Re-import config and set home so packages can find the fixture
		const freshConfig = (await import("../../../server/config")).default;
		const home = path.join(process.cwd(), "test", "fixtures", ".thelounge");
		freshConfig.setHome(home);

		packages = (await import("../../../server/plugins/packages")).default;
	});

	afterEach(function () {
		logInfoStub.restore();
		vi.restoreAllMocks();
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
		it("should display report about loading packages", async function () {
			// Need to stub the fresh log instance from the re-imported module
			logInfoStub.restore();

			const freshLog = (await import("../../../server/log")).default;
			let stdout = "";
			logInfoStub = sinon
				.stub(freshLog, "info")
				.callsFake(TestUtil.sanitizeLog((str) => (stdout += str)));
			packages.loadPackages();

			expect(stdout).to.deep.equal(
				"Package thelounge-package-foo vdummy loaded\nThere are packages using the experimental plugin API. Be aware that this API is not yet stable and may change in future The Lounge releases.\n"
			);
		});
	});
});
