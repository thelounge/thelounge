import {expect} from "vitest";
import os from "os";
import Helper from "../../server/helper";

describe("Helper", function () {
	describe("#expandHome", function () {
		it("should correctly expand a Unix path", function () {
			expect([`${os.homedir()}/tmp`, `${os.homedir()}\\tmp`]).to.include(
				Helper.expandHome("~/tmp")
			);
		});

		it("should correctly expand a Windows path", function () {
			expect(Helper.expandHome("~\\tmp")).to.equal(`${os.homedir()}\\tmp`);
		});

		it("should correctly expand when not given a specific path", function () {
			expect(Helper.expandHome("~")).to.equal(os.homedir());
		});

		it("should not expand paths not starting with tilde", function () {
			expect(Helper.expandHome("/tmp")).to.match(/^\/tmp|[a-zA-Z]:\\{1,2}tmp$/);
		});

		it("should not expand a tilde in the middle of a string", function () {
			expect(Helper.expandHome("/tmp/~foo")).to.match(
				/^\/tmp\/~foo|[a-zA-Z]:\\{1,2}?tmp\\{1,2}~foo$/
			);
		});

		it("should return an empty string when given an empty string", function () {
			expect(Helper.expandHome("")).to.equal("");
		});

		it("should return an empty string when given undefined", function () {
			expect(Helper.expandHome(undefined as any)).to.equal("");
		});
	});

	describe("#clientIp", function () {
		it("should return the socket address when not behind a proxy", function () {
			expect(Helper.clientIp("198.51.100.7", "203.0.113.5", false)).to.equal("198.51.100.7");
		});

		it("should fall back to localhost without a socket address", function () {
			expect(Helper.clientIp(undefined, undefined, false)).to.equal("127.0.0.1");
		});

		it("should strip the ipv4-mapped prefix", function () {
			expect(Helper.clientIp("::ffff:198.51.100.7", undefined, false)).to.equal(
				"198.51.100.7"
			);
		});

		it("should use the address added by the proxy, not the first one", function () {
			expect(Helper.clientIp("10.0.0.1", "203.0.113.5, 198.51.100.7", true)).to.equal(
				"198.51.100.7"
			);
		});

		it("should use a single forwarded address", function () {
			expect(Helper.clientIp("10.0.0.1", "2001:db8::1", true)).to.equal("2001:db8::1");
		});

		it("should accept the header as an array", function () {
			expect(Helper.clientIp("10.0.0.1", ["203.0.113.5", "198.51.100.7"], true)).to.equal(
				"198.51.100.7"
			);
		});

		it("should keep the socket address when the header is missing", function () {
			expect(Helper.clientIp("::ffff:10.0.0.1", undefined, true)).to.equal("10.0.0.1");
		});

		it("should keep the socket address when the last entry is not an ip", function () {
			expect(Helper.clientIp("10.0.0.1", "203.0.113.5, unknown", true)).to.equal("10.0.0.1");
		});
	});

	describe("#getVersion()", function () {
		const version = Helper.getVersion();

		it("should mention it is served from source code", function () {
			expect(version).to.include("source");
		});

		it("should include a short Git SHA", function () {
			expect(version).to.match(/\([0-9a-f]{7,11} /);
		});

		it("should include a valid semver version", function () {
			expect(version).to.match(/v[0-9]+\.[0-9]+\.[0-9]+/);
		});
	});
});
