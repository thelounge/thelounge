import fs from "fs";
import path from "path";
import crypto from "crypto";
import {expect} from "vitest";
import util from "../util";
import Config from "../../server/config";
import storage from "../../server/plugins/storage";
import link from "../../server/plugins/irc-events/link";
import {Request, Response} from "express";

describe("Image storage", function () {
	const testImagePath = path.resolve("client/public/img/logo-grey-bg-120x120px.png");
	const correctImageHash = crypto
		.createHash("sha256")
		.update(fs.readFileSync(testImagePath))
		.digest("hex");
	const correctImageURL = `storage/${correctImageHash.substring(
		0,
		2
	)}/${correctImageHash.substring(2, 4)}/${correctImageHash.substring(4)}.png`;

	const testSvgPath = path.resolve("client/public/img/logo-grey-bg.svg");
	const correctSvgHash = crypto
		.createHash("sha256")
		.update(fs.readFileSync(testSvgPath))
		.digest("hex");
	const correctSvgURL = `storage/${correctSvgHash.substring(0, 2)}/${correctSvgHash.substring(
		2,
		4
	)}/${correctSvgHash.substring(4)}.svg`;

	let app: any;
	let connection: any;
	let port: number;
	let host: string;
	let _makeUrl: (_path: string) => string;
	let irc: any;
	let network: any;

	beforeAll(function () {
		app = util.createWebserver();
		app.get("/real-test-image.png", function (_req: any, res: any) {
			res.sendFile(testImagePath);
		});
		app.get("/logo.svg", function (_req: any, res: any) {
			res.sendFile(testSvgPath);
		});

		return new Promise<void>((resolve) => {
			connection = app.listen(0, "127.0.0.1", () => {
				port = (connection.address() as any).port;
				host = (connection.address() as any).address;
				resolve();
			});
			_makeUrl = (_path: string): string => `http://${host}:${port}/${_path}`;
		});
	});

	afterAll(function () {
		return new Promise<void>((resolve) => {
			connection.close(() => resolve());
		});
	});

	afterAll(function () {
		// After storage tests run, remove the remaining empty
		// storage folder so we return to the clean state
		const dir = Config.getStoragePath();

		return new Promise<void>((resolve, reject) => {
			fs.rmdir(dir, (err) => (err ? reject(err) : resolve()));
		});
	});

	beforeEach(function () {
		irc = util.createClient();
		network = util.createNetwork();

		Config.values.prefetchStorage = true;
	});

	afterEach(function () {
		Config.values.prefetchStorage = false;
	});

	it("should store the thumbnail", function () {
		return new Promise<void>((resolve) => {
			const thumb_url = _makeUrl("thumb");
			const message = irc.createMessage({
				text: thumb_url,
			});

			link(irc, network.channels[0], message, message.text);

			const real_test_img_url = _makeUrl("real-test-image.png");
			app.get("/thumb", function (_req: any, res: any) {
				res.send(
					`<title>Google</title><meta property='og:image' content='${real_test_img_url}'>`
				);
			});

			irc.once("msg:preview", function (data: any) {
				expect(data.preview.head).to.equal("Google");
				expect(data.preview.link).to.equal(thumb_url);
				expect(data.preview.thumb).to.equal(correctImageURL);
				resolve();
			});
		});
	});

	it("should store the image", function () {
		return new Promise<void>((resolve) => {
			const real_test_img_url = _makeUrl("real-test-image.png");
			const message = irc.createMessage({
				text: real_test_img_url,
			});

			link(irc, network.channels[0], message, message.text);

			irc.once("msg:preview", function (data: any) {
				expect(data.preview.type).to.equal("image");
				expect(data.preview.link).to.equal(real_test_img_url);
				expect(data.preview.thumb).to.equal(correctImageURL);
				resolve();
			});
		});
	});

	it("should lookup correct extension type", function () {
		return new Promise<void>((resolve) => {
			const msg_url = _makeUrl("svg-preview");
			const message = irc.createMessage({
				text: msg_url,
			});

			const logo_url = _makeUrl("logo.svg");
			app.get("/svg-preview", function (_req: Request, res: Response) {
				res.send(
					`<title>test title</title><meta property='og:image' content='${logo_url}'>`
				);
			});

			link(irc, network.channels[0], message, message.text);

			irc.once("msg:preview", function (data: any) {
				expect(data.preview.type).to.equal("link");
				expect(data.preview.link).to.equal(msg_url);
				expect(data.preview.thumb).to.equal(correctSvgURL);
				resolve();
			});
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
