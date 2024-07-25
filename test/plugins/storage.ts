import fs from "fs";
import path from "path";
import crypto from "crypto";
import {expect} from "chai";
import util from "../util";
import Config from "../../server/config";
import storage from "../../server/plugins/storage";
import link from "../../server/plugins/irc-events/link";
import {Request, Response} from "express";

describe("Image storage", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(util.isRunningOnCI() ? 25000 : 5000);
	this.slow(300);

	const testImagePath = path.resolve(__dirname, "../../client/img/logo-grey-bg-120x120px.png");
	const correctImageHash = crypto
		.createHash("sha256")
		.update(fs.readFileSync(testImagePath))
		.digest("hex");
	const correctImageURL = `storage/${correctImageHash.substring(
		0,
		2
	)}/${correctImageHash.substring(2, 4)}/${correctImageHash.substring(4)}.png`;

	const testSvgPath = path.resolve(__dirname, "../../client/img/logo-grey-bg.svg");
	const correctSvgHash = crypto
		.createHash("sha256")
		.update(fs.readFileSync(testSvgPath))
		.digest("hex");
	const correctSvgURL = `storage/${correctSvgHash.substring(0, 2)}/${correctSvgHash.substring(
		2,
		4
	)}/${correctSvgHash.substring(4)}.svg`;

	before(function (done) {
		this.app = util.createWebserver();
		this.app.get("/real-test-image.png", function (req, res) {
			res.sendFile(testImagePath);
		});
		this.app.get("/logo.svg", function (req, res) {
			res.sendFile(testSvgPath);
		});
		this.connection = this.app.listen(0, "127.0.0.1", () => {
			this.port = this.connection.address().port;
			this.host = this.connection.address().address;
			done();
		});
		this._makeUrl = (_path: string): string => `http://${this.host}:${this.port}/${_path}`;
	});

	after(function (done) {
		this.connection.close(done);
	});

	after(function (done) {
		// After storage tests run, remove the remaining empty
		// storage folder so we return to the clean state
		const dir = Config.getStoragePath();
		fs.rmdir(dir, done);
	});

	beforeEach(function () {
		this.irc = util.createClient();
		this.network = util.createNetwork();

		Config.values.prefetchStorage = true;
	});

	afterEach(function () {
		Config.values.prefetchStorage = false;
	});

	it("should store the thumbnail", function (done) {
		const thumb_url = this._makeUrl("thumb");
		const message = this.irc.createMessage({
			text: thumb_url,
		});

		link(this.irc, this.network.channels[0], message, message.text);

		const real_test_img_url = this._makeUrl("real-test-image.png");
		this.app.get("/thumb", function (req, res) {
			res.send(
				`<title>Google</title><meta property='og:image' content='${real_test_img_url}'>`
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("Google");
			expect(data.preview.link).to.equal(thumb_url);
			expect(data.preview.thumb).to.equal(correctImageURL);
			done();
		});
	});

	it("should store the image", function (done) {
		const real_test_img_url = this._makeUrl("real-test-image.png");
		const message = this.irc.createMessage({
			text: real_test_img_url,
		});

		link(this.irc, this.network.channels[0], message, message.text);

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.type).to.equal("image");
			expect(data.preview.link).to.equal(real_test_img_url);
			expect(data.preview.thumb).to.equal(correctImageURL);
			done();
		});
	});

	it("should lookup correct extension type", function (done) {
		const msg_url = this._makeUrl("svg-preview");
		const message = this.irc.createMessage({
			text: msg_url,
		});

		const logo_url = this._makeUrl("logo.svg");
		this.app.get("/svg-preview", function (req: Request, res: Response) {
			res.send(`<title>test title</title><meta property='og:image' content='${logo_url}'>`);
		});

		link(this.irc, this.network.channels[0], message, message.text);

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.type).to.equal("link");
			expect(data.preview.link).to.equal(msg_url);
			expect(data.preview.thumb).to.equal(correctSvgURL);
			done();
		});
	});

	it("should clear storage folder", function () {
		const dir = Config.getStoragePath();

		expect(fs.readdirSync(dir)).to.not.be.empty;
		storage.emptyDir();
		expect(fs.readdirSync(dir)).to.be.empty;
		expect(fs.existsSync(dir)).to.be.true;
	});
});
