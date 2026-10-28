import crypto from "crypto";
import http from "http";
import {expect} from "vitest";
import sinon from "ts-sinon";
import log from "../../server/log";
import WebPush, {isAllowedPushEndpoint} from "../../server/plugins/webpush";

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

	it("rejects loopback, private, link-local and embedded ipv4 hosts", function () {
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
			"https://192.0.0.1/push",
			"https://192.168.1.1/push",
			"https://198.18.0.1/push",
			"https://224.0.0.1/push",
			"https://[::1]/push",
			"https://[::]/push",
			"https://[fd00::1]/push",
			"https://[fe80::1]/push",
			"https://[ff02::1]/push",
			"https://[::ffff:10.0.0.1]/push",
			"https://[::10.0.0.1]/push",
			"https://[64:ff9b::10.0.0.1]/push",
			"https://[2002:a00:1::]/push",
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
		expect(isAllowedPushEndpoint("https://198.17.0.1/push")).to.be.true;
		expect(isAllowedPushEndpoint("https://[2001:4860::1]/push")).to.be.true;
	});
});

describe("WebPush.pushSingle", function () {
	let server: http.Server;
	let port: number;
	let requests: string[];
	let logWarnStub: sinon.SinonStub<string[], void>;

	beforeAll(function () {
		logWarnStub = sinon.stub(log, "warn");

		return new Promise<void>((resolve) => {
			server = http.createServer((req, res) => {
				requests.push(req.url || "");

				if (req.url === "/redirect") {
					res.writeHead(302, {Location: "/target"});
				}

				res.end();
			});
			server.listen(0, "127.0.0.1", () => {
				port = (server.address() as any).port;
				resolve();
			});
		});
	});

	beforeEach(function () {
		requests = [];
	});

	afterAll(function () {
		logWarnStub.restore();

		return new Promise<void>((resolve) => {
			server.close(() => resolve());
		});
	});

	function subscriptionFor(path: string) {
		const {publicKey} = crypto.generateKeyPairSync("ec", {namedCurve: "prime256v1"});
		const jwk = publicKey.export({format: "jwk"});
		const point = Buffer.concat([
			Buffer.from([4]),
			Buffer.from(jwk.x!, "base64url"),
			Buffer.from(jwk.y!, "base64url"),
		]);

		return {
			endpoint: `http://127.0.0.1:${port}${path}`,
			keys: {
				p256dh: point.toString("base64url"),
				auth: crypto.randomBytes(16).toString("base64url"),
			},
		};
	}

	async function push(path: string) {
		const webPush = new WebPush();
		await webPush.init();
		(webPush as any).webPushModule = await import("web-push-neo");

		const subscription = subscriptionFor(path);
		const unregistered: string[] = [];
		const client = {
			name: "test",
			config: {sessions: {token: {pushSubscription: subscription}}},
			unregisterPushSubscription: (token: string) => unregistered.push(token),
		};

		await webPush.pushSingle(client as any, subscription, {type: "test"});

		return unregistered;
	}

	it("delivers to the endpoint", async function () {
		const unregistered = await push("/ok");

		expect(requests).to.deep.equal(["/ok"]);
		expect(unregistered).to.be.empty;
	});

	it("does not follow redirects and drops the subscription", async function () {
		const unregistered = await push("/redirect");

		expect(requests).to.deep.equal(["/redirect"]);
		expect(unregistered).to.deep.equal(["token"]);
	});
});
