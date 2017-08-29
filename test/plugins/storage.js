"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const expect = require("chai").expect;
const util = require("../util");
const Helper = require("../../src/helper");
const link = require("../../src/plugins/irc-events/link.js");

describe("Image storage", function() {
	const testImagePath = path.resolve(__dirname, "../../client/img/apple-touch-icon-120x120.png");
	const correctImageHash = crypto.createHash("sha256").update(fs.readFileSync(testImagePath)).digest("hex");
	const correctImageURL = `storage/${correctImageHash.substring(0, 2)}/${correctImageHash.substring(2, 4)}/${correctImageHash.substring(4)}.png`;

	before(function(done) {
		this.app = util.createWebserver();
		this.app.get("/real-test-image.png", function(req, res) {
			res.sendFile(testImagePath);
		});
		this.connection = this.app.listen(9003, done);
	});

	after(function(done) {
		this.connection.close(done);
	});

	beforeEach(function() {
		this.irc = util.createClient();
		this.network = util.createNetwork();

		Helper.config.prefetchStorage = true;
	});

	it("should store the thumbnail", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9003/thumb"
		});

		link(this.irc, this.network.channels[0], message);

		this.app.get("/thumb", function(req, res) {
			res.send("<title>Google</title><meta property='og:image' content='http://localhost:9003/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.head).to.equal("Google");
			expect(data.preview.link).to.equal("http://localhost:9003/thumb");
			expect(data.preview.thumb).to.equal(correctImageURL);
			done();
		});
	});

	it("should store the image", function(done) {
		const message = this.irc.createMessage({
			text: "http://localhost:9003/real-test-image.png"
		});

		link(this.irc, this.network.channels[0], message);

		this.irc.once("msg:preview", function(data) {
			expect(data.preview.type).to.equal("image");
			expect(data.preview.link).to.equal("http://localhost:9003/real-test-image.png");
			expect(data.preview.thumb).to.equal(correctImageURL);
			done();
		});
	});
});
