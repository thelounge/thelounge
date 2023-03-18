import log from "../server/log";
import Config from "../server/config";
import {expect} from "chai";
import got from "got";
import io from "socket.io-client";
import util from "./util";
import changelog from "../server/plugins/changelog";

import sinon from "ts-sinon";
import ClientManager from "../server/clientManager";

describe("Server", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(util.isRunningOnCI() ? 25000 : 5000);

	let server;
	let logInfoStub: sinon.SinonStub<string[], void>;
	let logWarnStub: sinon.SinonStub<string[], void>;
	let checkForUpdatesStub: sinon.SinonStub<[manager: ClientManager], void>;

	before(async function () {
		logInfoStub = sinon.stub(log, "info");
		logWarnStub = sinon.stub(log, "warn").callsFake((...args: string[]) => {
			// vapid.json permissions do not survive in git
			if (args.length > 1 && args[1] === "is world readable.") {
				return;
			}

			if (args.length > 0 && args[0].startsWith("run `chmod")) {
				return;
			}

			// eslint-disable-next-line no-console
			console.error(`Unhandled log.warn in server tests: ${args.join(" ")}`);
		});

		checkForUpdatesStub = sinon.stub(changelog, "checkForUpdates");
		server = await (await import("../server/server")).default({} as any);
	});

	after(function (done) {
		// Tear down test fixtures in the order they were setup,
		// in case setup crashed for any reason
		logInfoStub.restore();
		logWarnStub.restore();
		checkForUpdatesStub.restore();
		server.close(done);
	});

	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	const webURL = `http://${Config.values.host}:${Config.values.port}/`;

	describe("Express", () => {
		it("should run a web server on " + webURL, async () => {
			const response = await got(webURL);
			expect(response.statusCode).to.equal(200);
			expect(response.body).to.include("<title>The Lounge</title>");
			expect(response.body).to.include("js/bundle.js");
		});

		it("should serve static content correctly", async () => {
			const response = await got(webURL + "thelounge.webmanifest");
			const body = JSON.parse(response.body);

			expect(response.statusCode).to.equal(200);
			expect(body.name).to.equal("The Lounge");
			expect(response.headers["content-type"]).to.equal("application/manifest+json");
		});
	});

	describe("WebSockets", function () {
		this.slow(300);

		let client: ReturnType<typeof io>;

		beforeEach(() => {
			client = io(webURL, {
				path: "/socket.io/",
				autoConnect: false,
				reconnection: false,
				timeout: 1000,
				transports: ["websocket"],
			});

			// Server emits events faster than the test can bind them
			setTimeout(() => {
				client.open();
			}, 1);
		});

		afterEach(() => {
			client.close();
		});

		it("should emit authorized message", (done) => {
			client.on("auth:success", done);
		});

		it("should create network", (done) => {
			client.on("init", () => {
				client.emit("network:new", {
					username: "test-user",
					realname: "The Lounge Test",
					nick: "test-user",
					join: "#thelounge, #spam",
					name: "Test Network",
					host: Config.values.host,
					port: 6667,
				});
			});

			client.on("network", (data) => {
				expect(data.networks).to.be.an("array");
				expect(data.networks).to.have.lengthOf(1);
				expect(data.networks[0].nick).to.equal("test-user");
				expect(data.networks[0].name).to.equal("Test Network");
				expect(data.networks[0].channels).to.have.lengthOf(3);
				expect(data.networks[0].channels[0].name).to.equal("Test Network");
				expect(data.networks[0].channels[1].name).to.equal("#thelounge");
				expect(data.networks[0].channels[2].name).to.equal("#spam");
				done();
			});
		});

		it("should emit configuration message", (done) => {
			client.on("configuration", (data) => {
				// Private key defined in vapid.json is "01020304050607080910111213141516" for this public key.
				expect(data.applicationServerKey).to.equal(
					"BM0eTDpvDnH7ewlHuXWcPTE1NjlJ06XWIS1cQeBTZmsg4EDx5sOpY7kdX1pniTo8RakL3UdfFuIbC8_zog_BWIM"
				);

				expect(data.public).to.equal(true);
				expect(data.defaultTheme).to.equal("default");
				expect(data.themes).to.be.an("array");
				expect(data.lockNetwork).to.equal(false);
				expect(data.useHexIp).to.equal(false);

				done();
			});
		});

		it("should emit push subscription state message", (done) => {
			client.on("push:issubscribed", (data) => {
				expect(data).to.be.false;

				done();
			});
		});

		it("should emit init message", (done) => {
			client.on("init", (data) => {
				expect(data.active).to.equal(-1);
				expect(data.networks).to.be.an("array");
				expect(data.networks).to.be.empty;
				expect(data.token).to.be.null;

				done();
			});
		});
	});
});
