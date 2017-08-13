"use strict";

const path = require("path");
const expect = require("chai").expect;
const util = require("../util");
const Helper = require("../../src/helper");
const link = require("../../src/plugins/irc-events/link.js");

describe("Link plugin", function() {
	before(function(done) {
		this.app = util.createWebserver();
		this.app.get("/real-test-image.png", function(req, res) {
			res.sendFile(path.resolve(__dirname, "../../client/img/apple-touch-icon-120x120.png"));
		});
		this.connection = this.app.listen(9002, done);
	});

	after(function(done) {
		this.connection.close(done);
	});

	beforeEach(function() {
		this.irc = util.createClient();
		this.network = util.createNetwork();

		Helper.config.prefetchStorage = false;
	});

	it("should be able to fetch basic information about URLs", function(done) {
		const url = "http://localhost:9002/basic";
		const message = this.irc.createMessage({
			text: url
		});

		link(this.irc, this.network.channels[0], message);

		expect(message.previews).to.deep.equal([{
			body: "",
			head: "",
			link: url,
			thumb: "",
			type: "loading",
			shown: true,
		}]);

		this.app.get("/basic", function(req, res) {
			res.send("<title>test title</title><meta name='description' content='simple description'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.type).to.equal("link");
			expect(data.preview.head).to.equal("test title");
			expect(data.preview.body).to.equal("simple description");
			expect(data.preview.link).to.equal(url);

			expect(message.previews).to.deep.equal([data.preview]);
			done();
		});
	});

	it("should prefer og:title over title", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/basic-og"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/basic-og", function(req, res) {
			res.send("<title>test</title><meta property='og:title' content='opengraph test'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.head, "opengraph test");
			done();
		});
	});

	it("should prefer og:description over description", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/description-og"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/description-og", function(req, res) {
			res.send("<meta name='description' content='simple description'><meta property='og:description' content='opengraph description'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.body).to.equal("opengraph description");
			done();
		});
	});

	it("should find og:image with full url", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/thumb"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/thumb", function(req, res) {
			res.send("<title>Google</title><meta property='og:image' content='http://localhost:9002/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.head).to.equal("Google");
			expect(data.preview.thumb).to.equal("http://localhost:9002/real-test-image.png");
			done();
		});
	});

	it("should find image_src", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/thumb-image-src"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/thumb-image-src", function(req, res) {
			res.send("<link rel='image_src' href='http://localhost:9002/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.thumb).to.equal("http://localhost:9002/real-test-image.png");
			done();
		});
	});

	it("should correctly resolve relative protocol", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/thumb-image-src"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/thumb-image-src", function(req, res) {
			res.send("<link rel='image_src' href='//localhost:9002/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.thumb).to.equal("http://localhost:9002/real-test-image.png");
			done();
		});
	});

	it("should resolve url correctly for relative url", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/relative-thumb"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/relative-thumb", function(req, res) {
			res.send("<title>test relative image</title><meta property='og:image' content='/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.thumb).to.equal("http://localhost:9002/real-test-image.png");
			expect(data.preview.head).to.equal("test relative image");
			expect(data.preview.link).to.equal("http://localhost:9002/relative-thumb");
			done();
		});
	});

	it("should send untitled page if there is a thumbnail", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/thumb-no-title"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/thumb-no-title", function(req, res) {
			res.send("<meta property='og:image' content='http://localhost:9002/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.head).to.equal("Untitled page");
			expect(data.preview.thumb).to.equal("http://localhost:9002/real-test-image.png");
			expect(data.preview.link).to.equal("http://localhost:9002/thumb-no-title");
			done();
		});
	});

	it("should not send thumbnail if image is 404", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/thumb-404"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/thumb-404", function(req, res) {
			res.send("<title>404 image</title><meta property='og:image' content='http://localhost:9002/this-image-does-not-exist.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.head).to.equal("404 image");
			expect(data.preview.link).to.equal("http://localhost:9002/thumb-404");
			expect(data.preview.thumb).to.be.empty;
			done();
		});
	});

	it("should send image preview", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/real-test-image.png"
		});

		link(this.irc, this.network.channels[0], message);

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.type).to.equal("image");
			expect(data.preview.link).to.equal("http://localhost:9002/real-test-image.png");
			expect(data.preview.thumb).to.equal("http://localhost:9002/real-test-image.png");
			done();
		});
	});

	it("should load multiple URLs found in messages", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/one http://localhost:9002/two"
		});

		link(this.irc, this.network.channels[0], message);

		expect(message.previews).to.eql([{
			body: "",
			head: "",
			link: "http://localhost:9002/one",
			thumb: "",
			type: "loading",
			shown: true,
		}, {
			body: "",
			head: "",
			link: "http://localhost:9002/two",
			thumb: "",
			type: "loading",
			shown: true,
		}]);

		this.app.get("/one", function(req, res) {
			res.send("<title>first title</title>");
		});

		this.app.get("/two", function(req, res) {
			res.send("<title>second title</title>");
		});

		const previews = [];

		this.irc.on("msg:preview", function(data) {
			if (data.preview.link === "http://localhost:9002/one") {
				expect(data.preview.head).to.equal("first title");
				previews[0] = data.preview;
			} else if (data.preview.link === "http://localhost:9002/two") {
				expect(data.preview.head).to.equal("second title");
				previews[1] = data.preview;
			}

			if (previews[0] && previews[1]) {
				expect(message.previews).to.eql(previews);
				done();
			}
		});
	});
});
