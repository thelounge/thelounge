import path from "path";
import {expect} from "vitest";
import util from "../util";
import Config from "../../server/config";
import link from "../../server/plugins/irc-events/link";
import {LinkPreview} from "../../shared/types/msg";

describe("Link plugin", function () {
	// Increase timeout due to unpredictable I/O on CI services

	const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.\
Vivamus at pretium mauris. Aenean eu orci id erat pulvinar\
commodo cursus ac augue. Ut dui quam, tempus ac felis et,\
efficitur auctor nisl. Sed semper sit amet metus eu fringilla.\
Vivamus vitae ligula quis eros rutrum tristique. Suspendisse\
luctus molestie tortor, in finibus nulla rutrum quis. Proin\
congue ut elit eget congue. Nam pretium blandit nibh nec laoreet.\
Suspendisse vehicula turpis urna, sit amet molestie diam dapibus in.\
Vivamus bibendum vulputate tincidunt. Sed vitae ligula felis.`;

	let app;
	let connection: any;
	let port: number;
	let host: string;
	let _makeUrl: (path: string) => string;
	let irc: any;
	let network: any;

	beforeEach(function () {
		return new Promise<void>((resolve) => {
			app = util.createWebserver();
			app.get("/real-test-image.png", function (req, res) {
				res.sendFile(path.resolve("client/public/img/logo-grey-bg-120x120px.png"));
			});
			connection = app.listen(0, "127.0.0.1", () => {
				port = (connection.address() as any).port;
				host = (connection.address() as any).address;
				resolve();
			});

			_makeUrl = (_path: string): string => `http://${host}:${port}/${_path}`;

			irc = util.createClient();
			network = util.createNetwork();

			Config.values.prefetchStorage = false;
		});
	});

	afterEach(function () {
		return new Promise<void>((resolve) => {
			connection.close(() => resolve());
		});
	});

	it("should be able to fetch basic information about URLs", function () {
		return new Promise<void>((resolve) => {
			const url = _makeUrl("basic");
			const message = irc.createMessage({
				text: url,
			});

			link(irc, network.channels[0], message, message.text);

			expect(message.previews).to.deep.equal([
				{
					body: "",
					head: "",
					link: url,
					thumb: "",
					size: -1,
					type: "loading",
					shown: null,
				},
			]);

			app.get("/basic", function (req, res) {
				res.send(
					"<title>test title</title><meta name='description' content='simple description'>"
				);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.type).to.equal("link");
				expect(data.preview.head).to.equal("test title");
				expect(data.preview.body).to.equal("simple description");
				expect(data.preview.link).to.equal(url);

				expect(message.previews).to.deep.equal([data.preview]);
				resolve();
			});
		});
	});

	it("should be able to display body for text/plain", function () {
		return new Promise<void>((resolve) => {
			const url = _makeUrl("basic-text");
			const message = irc.createMessage({
				text: url,
			});

			link(irc, network.channels[0], message, message.text);

			expect(message.previews).to.deep.equal([
				{
					body: "",
					head: "",
					link: url,
					thumb: "",
					size: -1,
					type: "loading",
					shown: null,
				},
			]);

			app.get("/basic-text", function (req, res) {
				res.type("text").send(loremIpsum);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.type).to.equal("link");
				expect(data.preview.head).to.equal("Untitled page");
				expect(data.preview.body).to.equal(loremIpsum.substring(0, 300));
				expect(data.preview.body).to.have.length(300);
				expect(data.preview.link).to.equal(url);

				expect(message.previews).to.deep.equal([data.preview]);
				resolve();
			});
		});
	});

	it("should truncate head and body", function () {
		return new Promise<void>((resolve) => {
			const url = _makeUrl("truncate");
			const message = irc.createMessage({
				text: url,
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/truncate", function (req, res) {
				res.send(
					`<title>${loremIpsum}</title><meta name='description' content='${loremIpsum}'>`
				);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.type).to.equal("link");
				expect(data.preview.head).to.equal(loremIpsum.substring(0, 100));
				expect(data.preview.body).to.equal(loremIpsum.substring(0, 300));
				expect(data.preview.link).to.equal(url);

				expect(message.previews).to.deep.equal([data.preview]);
				resolve();
			});
		});
	});

	it("should prefer og:title over title", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("basic-og"),
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/basic-og", function (req, res) {
				res.send("<title>test</title><meta property='og:title' content='opengraph test'>");
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("opengraph test");
				resolve();
			});
		});
	});

	it("should find only the first matching tag", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("duplicate-tags"),
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/duplicate-tags", function (req, res) {
				res.send(
					"<title>test</title><title>magnifying glass icon</title><meta name='description' content='desc1'><meta name='description' content='desc2'>"
				);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("test");
				expect(data.preview.body).to.equal("desc1");
				resolve();
			});
		});
	});

	it("should prefer og:description over description", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("description-og"),
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/description-og", function (req, res) {
				res.send(
					"<meta name='description' content='simple description'><meta property='og:description' content='opengraph description'>"
				);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.body).to.equal("opengraph description");
				resolve();
			});
		});
	});

	it("should find og:image with full url", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("thumb"),
			});

			link(irc, network.channels[0], message, message.text);

			const url = _makeUrl("real-test-image.png");
			app.get("/thumb", function (req, res) {
				res.send(`<title>Google</title><meta property='og:image' content='${url}'>`);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("Google");
				expect(data.preview.thumb).to.equal(url);
				resolve();
			});
		});
	});

	describe("test disableMediaPreview", function () {
		beforeEach(function () {
			Config.values.disableMediaPreview = true;
		});
		afterEach(function () {
			Config.values.disableMediaPreview = false;
		});
		it("should ignore og:image if disableMediaPreview", function () {
			return new Promise<void>((resolve) => {
				app.get("/nonexistent-test-image.png", function () {
					throw "Should not fetch image";
				});

				const invalid_url = _makeUrl("nonexistent-test-image.png");
				app.get("/thumb", function (req, res) {
					res.send(
						`<title>Google</title><meta property='og:image' content='${invalid_url}>`
					);
				});
				const message = irc.createMessage({
					text: _makeUrl("thumb"),
				});

				link(irc, network.channels[0], message, message.text);

				irc.once("msg:preview", function (data) {
					expect(data.preview.head).to.equal("Google");
					expect(data.preview.type).to.equal("link");
					expect(data.preview.thumb).to.equal("");
					resolve();
				});
			});
		});
		it("should ignore og:video if disableMediaPreview", function () {
			return new Promise<void>((resolve) => {
				app.get("/nonexistent-video.mp4", function () {
					throw "Should not fetch video";
				});

				const invalid_url = _makeUrl("nonexistent-video.mp4");
				app.get("/thumb", function (req, res) {
					res.send(
						`<title>Google</title><meta property='og:video:type' content='video/mp4'><meta property='og:video' content='${invalid_url}'>`
					);
				});
				const message = irc.createMessage({
					text: _makeUrl("thumb"),
				});

				link(irc, network.channels[0], message, message.text);

				irc.once("msg:preview", function (data) {
					expect(data.preview.head).to.equal("Google");
					expect(data.preview.type).to.equal("link");
					resolve();
				});
			});
		});
	});

	it("should find image_src", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("thumb-image-src"),
			});

			link(irc, network.channels[0], message, message.text);

			const url = _makeUrl("real-test-image.png");
			app.get("/thumb-image-src", function (req, res) {
				res.send(`<link rel='image_src' href='${url}'>`);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.thumb).to.equal(url);
				resolve();
			});
		});
	});

	it("should correctly resolve relative protocol", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("thumb-image-src"),
			});

			link(irc, network.channels[0], message, message.text);

			const real_image_url = _makeUrl("real-test-image.png");
			app.get("/thumb-image-src", function (req, res) {
				res.send(`<link rel='image_src' href='${real_image_url}'>`);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.thumb).to.equal(real_image_url);
				resolve();
			});
		});
	});

	it("should resolve url correctly for relative url", function () {
		return new Promise<void>((resolve) => {
			const relative_thumb_url = _makeUrl("relative-thumb");
			const message = irc.createMessage({
				text: relative_thumb_url,
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/relative-thumb", function (req, res) {
				res.send(
					"<title>test relative image</title><meta property='og:image' content='/real-test-image.png'>"
				);
			});
			const real_image_url = _makeUrl("real-test-image.png");

			irc.once("msg:preview", function (data) {
				expect(data.preview.thumb).to.equal(real_image_url);
				expect(data.preview.head).to.equal("test relative image");
				expect(data.preview.link).to.equal(relative_thumb_url);
				resolve();
			});
		});
	});

	it("should send untitled page if there is a thumbnail", function () {
		return new Promise<void>((resolve) => {
			const real_image_url = _makeUrl("real-test-image.png");
			const thumb_no_title_url = _makeUrl("thumb-no-title");
			const message = irc.createMessage({
				text: thumb_no_title_url,
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/thumb-no-title", function (req, res) {
				res.send(`<meta property='og:image' content='${real_image_url}'>`);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("Untitled page");
				expect(data.preview.thumb).to.equal(real_image_url);
				expect(data.preview.link).to.equal(thumb_no_title_url);
				resolve();
			});
		});
	});

	it("should send untitled page if there is body", function () {
		return new Promise<void>((resolve) => {
			const body_no_title_url = _makeUrl("body-no-title");
			const message = irc.createMessage({
				text: body_no_title_url,
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/body-no-title", function (req, res) {
				res.send("<meta name='description' content='hello world'>");
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("Untitled page");
				expect(data.preview.body).to.equal("hello world");
				expect(data.preview.thumb).to.equal("");
				expect(data.preview.link).to.equal(body_no_title_url);
				resolve();
			});
		});
	});

	it("should not send thumbnail if image is 404", function () {
		return new Promise<void>((resolve) => {
			const thumb_404_url = _makeUrl("thumb-404");
			const message = irc.createMessage({
				text: thumb_404_url,
			});

			link(irc, network.channels[0], message, message.text);

			const invalid_url = _makeUrl("this-image-does-not-exist.png");
			app.get("/thumb-404", function (req, res) {
				res.send(
					`<title>404 image</title><meta property='og:image' content='${invalid_url}>`
				);
			});

			irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("404 image");
				expect(data.preview.link).to.equal(thumb_404_url);
				expect(data.preview.thumb).to.be.empty;
				resolve();
			});
		});
	});

	it("should send image preview", function () {
		return new Promise<void>((resolve) => {
			const real_image_url = _makeUrl("real-test-image.png");
			const message = irc.createMessage({
				text: real_image_url,
			});

			link(irc, network.channels[0], message, message.text);

			irc.once("msg:preview", function (data) {
				expect(data.preview.type).to.equal("image");
				expect(data.preview.link).to.equal(real_image_url);
				expect(data.preview.thumb).to.equal(real_image_url);
				expect(data.preview.size).to.equal(960);
				resolve();
			});
		});
	});

	it("should load multiple URLs found in messages", function () {
		return new Promise<void>((resolve) => {
			const url_one = _makeUrl("one");
			const url_two = _makeUrl("two");
			const message = irc.createMessage({
				text: `${url_one} ${url_two}`,
			});

			link(irc, network.channels[0], message, message.text);

			expect(message.previews).to.eql([
				{
					body: "",
					head: "",
					link: url_one,
					thumb: "",
					size: -1,
					type: "loading",
					shown: null,
				},
				{
					body: "",
					head: "",
					link: url_two,
					thumb: "",
					size: -1,
					type: "loading",
					shown: null,
				},
			]);

			app.get("/one", function (req, res) {
				res.send("<title>first title</title>");
			});

			app.get("/two", function (req, res) {
				res.send("<title>second title</title>");
			});

			const previews: LinkPreview[] = [];

			irc.on("msg:preview", function (data) {
				if (data.preview.link === url_one) {
					expect(data.preview.head).to.equal("first title");
					previews[0] = data.preview;
				} else if (data.preview.link === url_two) {
					expect(data.preview.head).to.equal("second title");
					previews[1] = data.preview;
				}

				if (previews[0] && previews[1]) {
					expect(message.previews).to.eql(previews);
					resolve();
				}
			});
		});
	});

	it("should use client's preferred language as Accept-Language header", function () {
		return new Promise<void>((resolve) => {
			const language = "sv,en-GB;q=0.9,en;q=0.8";
			irc.config.browser.language = language;

			app.get("/language-check", function (req, res) {
				expect(req.headers["accept-language"]).to.equal(language);
				res.send();
				resolve();
			});

			const message = irc.createMessage({
				text: _makeUrl("language-check"),
			});

			link(irc, network.channels[0], message, message.text);
		});
	});

	it("should send accept text/html for initial request", function () {
		return new Promise<void>((resolve) => {
			app.get("/accept-header-html", function (req, res) {
				expect(req.headers.accept).to.equal(
					"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
				);
				res.send();
				resolve();
			});

			const message = irc.createMessage({
				text: _makeUrl("accept-header-html"),
			});

			link(irc, network.channels[0], message, message.text);
		});
	});

	it("should send accept */* for meta image", function () {
		return new Promise<void>((resolve) => {
			const msg_url = _makeUrl("msg");
			const image_url = _makeUrl("image-url.png");
			app.get("/msg", function (req, res) {
				res.send(
					`<title>404 image</title><meta property='og:image' content='${image_url}'>`
				);
			});

			app.get("/image-url.png", function (req, res) {
				expect(req.headers.accept).to.equal("*/*");
				res.send();
				resolve();
			});

			const message = irc.createMessage({
				text: msg_url,
			});

			link(irc, network.channels[0], message, message.text);
		});
	});

	it("should not add slash to url", function () {
		return new Promise<void>((resolve) => {
			const url = _makeUrl("").slice(0, -1); // trim the trailing slash for testing
			const message = irc.createMessage({
				text: url,
			});

			link(irc, network.channels[0], message, message.text);

			irc.once("msg:preview", function (data) {
				expect(data.preview.link).to.equal(url);
				resolve();
			});
		});
	});

	it("should work on non-ASCII urls", function () {
		return new Promise<void>((resolve) => {
			const links = [
				"unicode/ıoı-test",
				"unicode/русский-текст-test",
				"unicode/🙈-emoji-test",
				"unicodeq/?q=ıoı-test",
				"unicodeq/?q=русский-текст-test",
				"unicodeq/?q=🙈-emoji-test",
			].map((p) => _makeUrl(p) as string);
			const message = irc.createMessage({
				text: links.join(" "),
			});

			link(irc, network.channels[0], message, message.text);

			app.get("/unicode/:q", function (req, res) {
				res.send(`<title>${req.params.q}</title>`);
			});

			app.get("/unicodeq/", function (req, res) {
				res.send(`<title>${req.query.q}</title>`);
			});

			const previews: LinkPreview[] = [];

			irc.on("msg:preview", function (data) {
				previews.push(data.preview.link);

				if (data.preview.link.includes("ıoı-test")) {
					expect(data.preview.head).to.equal("ıoı-test");
				} else if (data.preview.link.includes("русский-текст-test")) {
					expect(data.preview.head).to.equal("русский-текст-test");
				} else if (data.preview.link.includes("🙈-emoji-test")) {
					expect(data.preview.head).to.equal("🙈-emoji-test");
				} else {
					expect("This should never happen").to.equal(data.preview.link);
				}

				if (previews.length === 5) {
					expect(
						message.previews.map((preview) => preview.link as LinkPreview)
					).to.have.members(previews);
					resolve();
				}
			});
		});
	});

	it("should not fetch links without a schema", function () {
		const message = irc.createMessage({
			text: `//${host}:${port} ${host}:${port} //${host}:${port}/test ${host}:${port}/test`,
		});

		link(irc, network.channels[0], message, message.text);

		expect(message.previews).to.be.empty;
	});

	it("should de-duplicate links", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: `//${host}:${port}/ http://${host}:${port}/ http://${host}:${port}/`,
			});

			link(irc, network.channels[0], message, message.text);

			const root_url = _makeUrl("");
			expect(message.previews).to.deep.equal([
				{
					type: "loading",
					head: "",
					body: "",
					thumb: "",
					size: -1,
					link: root_url,
					shown: null,
				},
			]);

			irc.once("msg:preview", function (data) {
				expect(data.preview.link).to.equal(root_url);
				expect(data.preview.type).to.equal("error");
				resolve();
			});
		});
	});

	it("should not try to fetch links with wrong protocol", function () {
		const message = irc.createMessage({
			text: "ssh://example.com ftp://example.com irc://example.com http:////////example.com",
		});

		expect(message.previews).to.be.empty;
	});

	it("should not try to fetch links with username or password", function () {
		const message = irc.createMessage({
			text: "http://root:'some%pass'@hostname/database http://a:%p@c http://a:%p@example.com http://test@example.com",
		});

		expect(message.previews).to.be.empty;
	});

	it("should fetch same link only once at the same time", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("basic-og-once"),
			});

			let requests = 0;
			let responses = 0;

			irc.config.browser.language = "very nice language";

			link(irc, network.channels[0], message, message.text);
			link(irc, network.channels[0], message, message.text);
			process.nextTick(() => link(irc, network.channels[0], message, message.text));

			app.get("/basic-og-once", function (req, res) {
				requests++;

				expect(req.header("accept-language")).to.equal("very nice language");

				// delay the request so it doesn't resolve immediately
				setTimeout(() => {
					res.send("<title>test prefetch</title>");
				}, 100);
			});

			const cb = (data) => {
				responses++;

				expect(data.preview.head, "test prefetch");

				if (responses === 3) {
					irc.removeListener("msg:preview", cb);
					expect(requests).to.equal(1);
					resolve();
				}
			};

			irc.on("msg:preview", cb);
		});
	});

	it("should fetch same link with different languages multiple times", function () {
		return new Promise<void>((resolve) => {
			const message = irc.createMessage({
				text: _makeUrl("basic-og-once-lang"),
			});

			const requests: string[] = [];
			let responses = 0;

			irc.config.browser.language = "first language";
			link(irc, network.channels[0], message, message.text);

			setTimeout(() => {
				irc.config.browser.language = "second language";
				link(irc, network.channels[0], message, message.text);
			}, 100);

			app.get("/basic-og-once-lang", function (req, res) {
				requests.push(req.header("accept-language"));

				// delay the request so it doesn't resolve immediately
				setTimeout(() => {
					res.send("<title>test prefetch</title>");
				}, 100);
			});

			const cb = (data) => {
				responses++;

				expect(data.preview.head, "test prefetch");

				if (responses === 2) {
					irc.removeListener("msg:preview", cb);
					expect(requests).to.deep.equal(["first language", "second language"]);
					resolve();
				}
			};

			irc.on("msg:preview", cb);
		});
	});
});
