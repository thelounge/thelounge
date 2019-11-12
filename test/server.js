"use strict";

const log = require("../src/log");
const Helper = require("../src/helper");
const expect = require("chai").expect;
const got = require("got");
const io = require("socket.io-client");

describe("Server", function() {
	// Travis is having issues with slow workers and thus tests timeout
	this.timeout(process.env.CI ? 25000 : 5000);

	let server;
	let originalLogInfo;

	before(function() {
		originalLogInfo = log.info;

		log.info = () => {};

		server = require("../src/server")();
	});

	after(function(done) {
		server.close(done);

		log.info = originalLogInfo;
	});

	const webURL = `http://${Helper.config.host}:${Helper.config.port}/`;

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

	describe("WebSockets", function() {
		this.slow(300);

		let client;

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
					host: Helper.config.host,
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
				expect(data.displayNetwork).to.equal(true);
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
