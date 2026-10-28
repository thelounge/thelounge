import {expect} from "vitest";
import {isAllowedPushEndpoint} from "../../server/plugins/webpush";

describe("isAllowedPushEndpoint", function () {
	it("accepts https endpoints on public hosts", function () {
		expect(isAllowedPushEndpoint("https://updates.push.services.mozilla.com/wpush/v2/abc")).to
			.be.true;
		expect(isAllowedPushEndpoint("https://fcm.googleapis.com/fcm/send/abc")).to.be.true;
		expect(isAllowedPushEndpoint("https://203.0.113.5/push")).to.be.true;
		expect(isAllowedPushEndpoint("https://[2001:db8::1]/push")).to.be.true;
	});

	it("rejects anything that is not https", function () {
		expect(isAllowedPushEndpoint("http://updates.push.services.mozilla.com/wpush/v2/abc")).to.be
			.false;
		expect(isAllowedPushEndpoint("ftp://example.com/push")).to.be.false;
		expect(isAllowedPushEndpoint("not a url")).to.be.false;
		expect(isAllowedPushEndpoint("")).to.be.false;
	});

	it("rejects loopback, private and link-local hosts", function () {
		for (const endpoint of [
			"https://localhost/push",
			"https://push.localhost/push",
			"https://127.0.0.1/push",
			"https://127.1.2.3/push",
			"https://0.0.0.0/push",
			"https://10.1.2.3/push",
			"https://100.64.0.1/push",
			"https://169.254.169.254/latest/meta-data/",
			"https://172.16.0.1/push",
			"https://172.31.255.255/push",
			"https://192.168.1.1/push",
			"https://[::1]/push",
			"https://[::]/push",
			"https://[fd00::1]/push",
			"https://[fe80::1]/push",
			"https://[::ffff:10.0.0.1]/push",
		]) {
			expect(isAllowedPushEndpoint(endpoint), endpoint).to.be.false;
		}
	});

	it("does not treat neighbouring public ranges as private", function () {
		expect(isAllowedPushEndpoint("https://172.15.0.1/push")).to.be.true;
		expect(isAllowedPushEndpoint("https://172.32.0.1/push")).to.be.true;
		expect(isAllowedPushEndpoint("https://100.63.0.1/push")).to.be.true;
		expect(isAllowedPushEndpoint("https://100.128.0.1/push")).to.be.true;
		expect(isAllowedPushEndpoint("https://11.0.0.1/push")).to.be.true;
	});
});
