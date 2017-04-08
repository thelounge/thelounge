"use strict";

const Helper = require("../src/helper");
const expect = require("chai").expect;
const request = require("request");
const io = require("socket.io-client");

describe("Server", () => {
	const server = require("../src/server");
	server();

	const webURL = `http://${Helper.config.host}:${Helper.config.port}/`;

	describe("Express", () => {
		it("should run a web server on " + webURL, (done) => {
			request(webURL, (error, response, body) => {
				expect(error).to.be.null;
				expect(body).to.include("<title>The Lounge</title>");
				expect(body).to.include("https://thelounge.github.io/");

				done();
			});
		});

		it("should serve static content correctly", (done) => {
			request(webURL + "manifest.json", (error, response, body) => {
				expect(error).to.be.null;

				body = JSON.parse(body);
				expect(body.name).to.equal("The Lounge");

				done();
			});
		});
	});

	describe("WebSockets", () => {
		let client;

		beforeEach(() => {
			client = io(webURL, {
				path: "/socket.io/",
				autoConnect: false,
				reconnection: false,
				timeout: 1000,
				transports: [
					"websocket"
				]
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
			client.on("authorized", done);
		});

		it("should create network", (done) => {
			client.on("init", () => {
				client.emit("conn", {
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
				expect(data.networks[0].realname).to.equal("The Lounge Test");
				expect(data.networks[0].channels).to.have.lengthOf(3);
				expect(data.networks[0].channels[0].name).to.equal("Test Network");
				expect(data.networks[0].channels[1].name).to.equal("#thelounge");
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
