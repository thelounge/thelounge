"use strict";

var assert = require("assert");

var util = require("../util");
var link = require("../../src/plugins/irc-events/link.js");
const path = require("path");

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
	});

	it("should be able to fetch basic information about URLs", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/basic"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/basic", function(req, res) {
			res.send("<title>test title</title><meta name='description' content='simple description'>");
		});

		this.irc.once("msg:preview", function(data) {
			assert.equal(data.preview.type, "link");
			assert.equal(data.preview.head, "test title");
			assert.equal(data.preview.body, "simple description");
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
			assert.equal(data.preview.head, "opengraph test");
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
			assert.equal(data.preview.body, "opengraph description");
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
			assert.equal(data.preview.head, "Google");
			assert.equal(data.preview.thumb, "http://localhost:9002/real-test-image.png");
			done();
		});
	});

	it("should not use thumbnail with invalid url", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/invalid-thumb"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/invalid-thumb", function(req, res) {
			res.send("<title>test</title><meta property='og:image' content='/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			assert.equal(data.preview.thumb, "");
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
			assert.equal(data.preview.head, "Untitled page");
			assert.equal(data.preview.thumb, "http://localhost:9002/real-test-image.png");
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
			assert.equal(data.preview.head, "404 image");
			assert.equal(data.preview.thumb, "");
			done();
		});
	});

	it("should send image preview", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9002/real-test-image.png"
		});

		link(this.irc, this.network.channels[0], message);

		this.irc.once("msg:preview", function(data) {
			assert.equal(data.preview.type, "image");
			assert.equal(data.preview.link, "http://localhost:9002/real-test-image.png");
			done();
		});
	});
});
