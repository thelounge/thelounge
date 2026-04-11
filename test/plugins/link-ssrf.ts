import {expect} from "chai";
import {isPrivateIP, normalizeURL} from "../../server/plugins/irc-events/link";

describe("SSRF protection", function () {
	describe("isPrivateIP", function () {
		it("should block loopback addresses", function () {
			expect(isPrivateIP("127.0.0.1")).to.be.true;
			expect(isPrivateIP("127.0.0.2")).to.be.true;
			expect(isPrivateIP("127.255.255.255")).to.be.true;
		});

		it("should block class A private range (10.x.x.x)", function () {
			expect(isPrivateIP("10.0.0.1")).to.be.true;
			expect(isPrivateIP("10.255.255.255")).to.be.true;
		});

		it("should block class B private range (172.16-31.x.x)", function () {
			expect(isPrivateIP("172.16.0.1")).to.be.true;
			expect(isPrivateIP("172.31.255.255")).to.be.true;
			expect(isPrivateIP("172.15.255.255")).to.be.false;
			expect(isPrivateIP("172.32.0.0")).to.be.false;
		});

		it("should block class C private range (192.168.x.x)", function () {
			expect(isPrivateIP("192.168.0.1")).to.be.true;
			expect(isPrivateIP("192.168.255.255")).to.be.true;
		});

		it("should block link-local / cloud metadata (169.254.x.x)", function () {
			expect(isPrivateIP("169.254.169.254")).to.be.true;
			expect(isPrivateIP("169.254.0.1")).to.be.true;
		});

		it("should block 'this' network (0.x.x.x)", function () {
			expect(isPrivateIP("0.0.0.0")).to.be.true;
			expect(isPrivateIP("0.255.255.255")).to.be.true;
		});

		it("should block carrier-grade NAT (100.64-127.x.x)", function () {
			expect(isPrivateIP("100.64.0.1")).to.be.true;
			expect(isPrivateIP("100.127.255.255")).to.be.true;
			expect(isPrivateIP("100.63.255.255")).to.be.false;
			expect(isPrivateIP("100.128.0.1")).to.be.false;
		});

		it("should block IPv6 loopback", function () {
			expect(isPrivateIP("::1")).to.be.true;
		});

		it("should block IPv6 unique local addresses", function () {
			expect(isPrivateIP("fc00::1")).to.be.true;
			expect(isPrivateIP("fd12:3456::1")).to.be.true;
		});

		it("should block IPv6 link-local addresses", function () {
			expect(isPrivateIP("fe80::1")).to.be.true;
		});

		it("should block IPv6-mapped IPv4 private addresses", function () {
			expect(isPrivateIP("::ffff:127.0.0.1")).to.be.true;
			expect(isPrivateIP("::ffff:10.0.0.1")).to.be.true;
			expect(isPrivateIP("::ffff:169.254.169.254")).to.be.true;
			expect(isPrivateIP("::ffff:192.168.1.1")).to.be.true;
		});

		it("should block IPv6-mapped IPv4 with brackets from URL parsing", function () {
			expect(isPrivateIP("[::ffff:127.0.0.1]")).to.be.true;
			expect(isPrivateIP("[::1]")).to.be.true;
		});

		it("should allow public IP addresses", function () {
			expect(isPrivateIP("8.8.8.8")).to.be.false;
			expect(isPrivateIP("1.1.1.1")).to.be.false;
			expect(isPrivateIP("93.184.216.34")).to.be.false;
			expect(isPrivateIP("203.0.113.1")).to.be.false;
		});

		it("should allow public IPv6-mapped IPv4 addresses", function () {
			expect(isPrivateIP("::ffff:8.8.8.8")).to.be.false;
		});
	});

	describe("normalizeURL with SSRF protection", function () {
		it("should reject private IP literals", function () {
			expect(normalizeURL("http://127.0.0.1/")).to.be.undefined;
			expect(normalizeURL("http://10.0.0.1/admin")).to.be.undefined;
			expect(normalizeURL("http://192.168.1.1/")).to.be.undefined;
			expect(normalizeURL("http://169.254.169.254/latest/meta-data/")).to.be.undefined;
			expect(normalizeURL("http://172.16.0.1:8080/")).to.be.undefined;
		});

		it("should reject alternative IP representations normalized by URL parser", function () {
			// Decimal integer (169085621 = 10.20.10.181 — private)
			expect(normalizeURL("http://169085621/")).to.be.undefined;
			// Hex (0x7f000001 = 127.0.0.1)
			expect(normalizeURL("http://0x7f000001/")).to.be.undefined;
			// Octal (0177.0.0.1 = 127.0.0.1)
			expect(normalizeURL("http://0177.0.0.1/")).to.be.undefined;
		});

		it("should reject private IPs with https", function () {
			expect(normalizeURL("https://127.0.0.1/")).to.be.undefined;
			expect(normalizeURL("https://10.0.0.1/")).to.be.undefined;
		});

		it("should reject IPv6-mapped private IPs", function () {
			expect(normalizeURL("http://[::ffff:127.0.0.1]/")).to.be.undefined;
			expect(normalizeURL("http://[::ffff:169.254.169.254]/")).to.be.undefined;
		});

		it("should allow public IP literals", function () {
			expect(normalizeURL("http://8.8.8.8/")).to.equal("http://8.8.8.8/");
			expect(normalizeURL("http://93.184.216.34/")).to.equal("http://93.184.216.34/");
		});

		it("should allow hostnames (DNS checked at fetch time)", function () {
			expect(normalizeURL("http://example.com/")).to.equal("http://example.com/");
			expect(normalizeURL("https://github.com/path")).to.equal("https://github.com/path");
		});

		it("should still reject non-http protocols", function () {
			expect(normalizeURL("ftp://example.com/")).to.be.undefined;
			expect(normalizeURL("file:///etc/passwd")).to.be.undefined;
		});

		it("should still reject URLs with credentials", function () {
			expect(normalizeURL("http://user:pass@example.com/")).to.be.undefined;
			expect(normalizeURL("http://user@example.com/")).to.be.undefined;
		});
	});
});
