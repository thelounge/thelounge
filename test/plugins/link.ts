/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import path from "path";
import {expect} from "chai";
import util from "../util";
import Config from "../../server/config";
import link, {LinkPreview} from "../../server/plugins/irc-events/link";

describe("Link plugin", function () {
	// Increase timeout due to unpredictable I/O on CI services
	this.timeout(util.isRunningOnCI() ? 25000 : 5000);
	this.slow(300);

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

	beforeEach(function (done) {
		app = util.createWebserver();
		app.get("/real-test-image.png", function (req, res) {
			res.sendFile(path.resolve(__dirname, "../../client/img/logo-grey-bg-120x120px.png"));
		});
		this.connection = app.listen(0, () => {
			this.port = this.connection.address().port;
			done();
		});

		this.irc = util.createClient();
		this.network = util.createNetwork();

		Config.values.prefetchStorage = false;
	});

	afterEach(function (done) {
		this.connection.close(done);
	});

	it("should be able to fetch basic information about URLs", function (done) {
		const url = "http://localhost:" + this.port + "/basic";
		const message = this.irc.createMessage({
			text: url,
		});

		link(this.irc, this.network.channels[0], message, message.text);

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

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.type).to.equal("link");
			expect(data.preview.head).to.equal("test title");
			expect(data.preview.body).to.equal("simple description");
			expect(data.preview.link).to.equal(url);

			expect(message.previews).to.deep.equal([data.preview]);
			done();
		});
	});

	it("should be able to display body for text/plain", function (done) {
		const url = "http://localhost:" + this.port + "/basic-text";
		const message = this.irc.createMessage({
			text: url,
		});

		link(this.irc, this.network.channels[0], message, message.text);

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

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.type).to.equal("link");
			expect(data.preview.head).to.equal("Untitled page");
			expect(data.preview.body).to.equal(loremIpsum.substring(0, 300));
			expect(data.preview.body).to.have.length(300);
			expect(data.preview.link).to.equal(url);

			expect(message.previews).to.deep.equal([data.preview]);
			done();
		});
	});

	it("should truncate head and body", function (done) {
		const url = "http://localhost:" + this.port + "/truncate";
		const message = this.irc.createMessage({
			text: url,
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/truncate", function (req, res) {
			res.send(
				`<title>${loremIpsum}</title><meta name='description' content='${loremIpsum}'>`
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.type).to.equal("link");
			expect(data.preview.head).to.equal(loremIpsum.substring(0, 100));
			expect(data.preview.body).to.equal(loremIpsum.substring(0, 300));
			expect(data.preview.link).to.equal(url);

			expect(message.previews).to.deep.equal([data.preview]);
			done();
		});
	});

	it("should prefer og:title over title", function (done) {
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/basic-og",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/basic-og", function (req, res) {
			res.send("<title>test</title><meta property='og:title' content='opengraph test'>");
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("opengraph test");
			done();
		});
	});

	it("should find only the first matching tag", function (done) {
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/duplicate-tags",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/duplicate-tags", function (req, res) {
			res.send(
				"<title>test</title><title>magnifying glass icon</title><meta name='description' content='desc1'><meta name='description' content='desc2'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("test");
			expect(data.preview.body).to.equal("desc1");
			done();
		});
	});

	it("should prefer og:description over description", function (done) {
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/description-og",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/description-og", function (req, res) {
			res.send(
				"<meta name='description' content='simple description'><meta property='og:description' content='opengraph description'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.body).to.equal("opengraph description");
			done();
		});
	});

	it("should find og:image with full url", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/thumb",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/thumb", function (req, res) {
			res.send(
				"<title>Google</title><meta property='og:image' content='http://localhost:" +
					port +
					"/real-test-image.png'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("Google");
			expect(data.preview.thumb).to.equal(
				"http://localhost:" + port + "/real-test-image.png"
			);
			done();
		});
	});

	describe("test disableMediaPreview", function () {
		beforeEach(function (done) {
			Config.values.disableMediaPreview = true;
			done();
		});
		afterEach(function (done) {
			Config.values.disableMediaPreview = false;
			done();
		});
		it("should ignore og:image if disableMediaPreview", function (done) {
			const port = this.port;

			app.get("/nonexistent-test-image.png", function () {
				throw "Should not fetch image";
			});

			app.get("/thumb", function (req, res) {
				res.send(
					"<title>Google</title><meta property='og:image' content='http://localhost:" +
						port +
						"/nonexistent-test-image.png'>"
				);
			});
			const message = this.irc.createMessage({
				text: "http://localhost:" + port + "/thumb",
			});

			link(this.irc, this.network.channels[0], message, message.text);

			this.irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("Google");
				expect(data.preview.type).to.equal("link");
				expect(data.preview.thumb).to.equal("");
				done();
			});
		});
		it("should ignore og:video if disableMediaPreview", function (done) {
			const port = this.port;

			app.get("/nonexistent-video.mpr", function () {
				throw "Should not fetch video";
			});

			app.get("/thumb", function (req, res) {
				res.send(
					"<title>Google</title><meta property='og:video:type' content='video/mp4'><meta property='og:video' content='http://localhost:" +
						port +
						"/nonexistent-video.mp4'>"
				);
			});
			const message = this.irc.createMessage({
				text: "http://localhost:" + port + "/thumb",
			});

			link(this.irc, this.network.channels[0], message, message.text);

			this.irc.once("msg:preview", function (data) {
				expect(data.preview.head).to.equal("Google");
				expect(data.preview.type).to.equal("link");
				done();
			});
		});
	});

	it("should find image_src", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/thumb-image-src",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/thumb-image-src", function (req, res) {
			res.send(
				"<link rel='image_src' href='http://localhost:" + port + "/real-test-image.png'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.thumb).to.equal(
				"http://localhost:" + port + "/real-test-image.png"
			);
			done();
		});
	});

	it("should correctly resolve relative protocol", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/thumb-image-src",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/thumb-image-src", function (req, res) {
			res.send("<link rel='image_src' href='//localhost:" + port + "/real-test-image.png'>");
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.thumb).to.equal(
				"http://localhost:" + port + "/real-test-image.png"
			);
			done();
		});
	});

	it("should resolve url correctly for relative url", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/relative-thumb",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/relative-thumb", function (req, res) {
			res.send(
				"<title>test relative image</title><meta property='og:image' content='/real-test-image.png'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.thumb).to.equal(
				"http://localhost:" + port + "/real-test-image.png"
			);
			expect(data.preview.head).to.equal("test relative image");
			expect(data.preview.link).to.equal("http://localhost:" + port + "/relative-thumb");
			done();
		});
	});

	it("should send untitled page if there is a thumbnail", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/thumb-no-title",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/thumb-no-title", function (req, res) {
			res.send(
				"<meta property='og:image' content='http://localhost:" +
					port +
					"/real-test-image.png'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("Untitled page");
			expect(data.preview.thumb).to.equal(
				"http://localhost:" + port + "/real-test-image.png"
			);
			expect(data.preview.link).to.equal("http://localhost:" + port + "/thumb-no-title");
			done();
		});
	});

	it("should send untitled page if there is body", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/body-no-title",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/body-no-title", function (req, res) {
			res.send("<meta name='description' content='hello world'>");
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("Untitled page");
			expect(data.preview.body).to.equal("hello world");
			expect(data.preview.thumb).to.equal("");
			expect(data.preview.link).to.equal("http://localhost:" + port + "/body-no-title");
			done();
		});
	});

	it("should not send thumbnail if image is 404", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/thumb-404",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/thumb-404", function (req, res) {
			res.send(
				"<title>404 image</title><meta property='og:image' content='http://localhost:" +
					port +
					"/this-image-does-not-exist.png'>"
			);
		});

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.head).to.equal("404 image");
			expect(data.preview.link).to.equal("http://localhost:" + port + "/thumb-404");
			expect(data.preview.thumb).to.be.empty;
			done();
		});
	});

	it("should send image preview", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + port + "/real-test-image.png",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.type).to.equal("image");
			expect(data.preview.link).to.equal("http://localhost:" + port + "/real-test-image.png");
			expect(data.preview.thumb).to.equal(
				"http://localhost:" + port + "/real-test-image.png"
			);
			expect(data.preview.size).to.equal(960);
			done();
		});
	});

	it("should load multiple URLs found in messages", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + port + "/one http://localhost:" + this.port + "/two",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		expect(message.previews).to.eql([
			{
				body: "",
				head: "",
				link: "http://localhost:" + port + "/one",
				thumb: "",
				size: -1,
				type: "loading",
				shown: null,
			},
			{
				body: "",
				head: "",
				link: "http://localhost:" + port + "/two",
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

		this.irc.on("msg:preview", function (data) {
			if (data.preview.link === "http://localhost:" + port + "/one") {
				expect(data.preview.head).to.equal("first title");
				previews[0] = data.preview;
			} else if (data.preview.link === "http://localhost:" + port + "/two") {
				expect(data.preview.head).to.equal("second title");
				previews[1] = data.preview;
			}

			if (previews[0] && previews[1]) {
				expect(message.previews).to.eql(previews);
				done();
			}
		});
	});

	it("should use client's preferred language as Accept-Language header", function (done) {
		const language = "sv,en-GB;q=0.9,en;q=0.8";
		this.irc.config.browser.language = language;

		app.get("/language-check", function (req, res) {
			expect(req.headers["accept-language"]).to.equal(language);
			res.send();
			done();
		});

		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/language-check",
		});

		link(this.irc, this.network.channels[0], message, message.text);
	});

	it("should send accept text/html for initial request", function (done) {
		app.get("/accept-header-html", function (req, res) {
			expect(req.headers.accept).to.equal(
				"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
			);
			res.send();
			done();
		});

		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/accept-header-html",
		});

		link(this.irc, this.network.channels[0], message, message.text);
	});

	it("should send accept */* for meta image", function (done) {
		const port = this.port;

		app.get("/accept-header-thumb", function (req, res) {
			res.send(
				"<title>404 image</title><meta property='og:image' content='http://localhost:" +
					port +
					"/accept-header-thumb.png'>"
			);
		});

		app.get("/accept-header-thumb.png", function (req, res) {
			expect(req.headers.accept).to.equal("*/*");
			res.send();
			done();
		});

		const message = this.irc.createMessage({
			text: "http://localhost:" + port + "/accept-header-thumb",
		});

		link(this.irc, this.network.channels[0], message, message.text);
	});

	it("should not add slash to url", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text: "http://localhost:" + port + "",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.link).to.equal("http://localhost:" + port + "");
			done();
		});
	});

	it("should work on non-ASCII urls", function (done) {
		const message = this.irc.createMessage({
			text:
				"http://localhost:" +
				this.port +
				"/unicode/ıoı-test " +
				"http://localhost:" +
				this.port +
				"/unicode/русский-текст-test " +
				"http://localhost:" +
				this.port +
				"/unicode/🙈-emoji-test " +
				"http://localhost:" +
				this.port +
				"/unicodeq/?q=ıoı-test " +
				"http://localhost:" +
				this.port +
				"/unicodeq/?q=русский-текст-test " +
				"http://localhost:" +
				this.port +
				"/unicodeq/?q=🙈-emoji-test",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		app.get("/unicode/:q", function (req, res) {
			res.send(`<title>${req.params.q}</title>`);
		});

		app.get("/unicodeq/", function (req, res) {
			res.send(`<title>${req.query.q}</title>`);
		});

		const previews: LinkPreview[] = [];

		this.irc.on("msg:preview", function (data) {
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
				done();
			}
		});
	});

	it("should not fetch links without a schema", function () {
		const port = this.port;
		const message = this.irc.createMessage({
			text: `//localhost:${port} localhost:${port} //localhost:${port}/test localhost:${port}/test`,
		});

		link(this.irc, this.network.channels[0], message, message.text);

		expect(message.previews).to.be.empty;
	});

	it("should de-duplicate links", function (done) {
		const port = this.port;
		const message = this.irc.createMessage({
			text:
				"//localhost:" +
				port +
				" http://localhost:" +
				port +
				" http://localhost:" +
				port +
				"",
		});

		link(this.irc, this.network.channels[0], message, message.text);

		expect(message.previews).to.deep.equal([
			{
				type: "loading",
				head: "",
				body: "",
				thumb: "",
				size: -1,
				link: "http://localhost:" + port + "",
				shown: null,
			},
		]);

		this.irc.once("msg:preview", function (data) {
			expect(data.preview.link).to.equal("http://localhost:" + port + "");
			expect(data.preview.type).to.equal("error");
			done();
		});
	});

	it("should not try to fetch links with wrong protocol", function () {
		const message = this.irc.createMessage({
			text: "ssh://example.com ftp://example.com irc://example.com http:////////example.com",
		});

		expect(message.previews).to.be.empty;
	});

	it("should not try to fetch links with username or password", function () {
		const message = this.irc.createMessage({
			text: "http://root:'some%pass'@hostname/database http://a:%p@c http://a:%p@example.com http://test@example.com",
		});

		expect(message.previews).to.be.empty;
	});

	it("should fetch same link only once at the same time", function (done) {
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/basic-og-once",
		});

		let requests = 0;
		let responses = 0;

		this.irc.config.browser.language = "very nice language";

		link(this.irc, this.network.channels[0], message, message.text);
		link(this.irc, this.network.channels[0], message, message.text);
		process.nextTick(() => link(this.irc, this.network.channels[0], message, message.text));

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
				this.irc.removeListener("msg:preview", cb);
				expect(requests).to.equal(1);
				done();
			}
		};

		this.irc.on("msg:preview", cb);
	});

	it("should fetch same link with different languages multiple times", function (done) {
		const message = this.irc.createMessage({
			text: "http://localhost:" + this.port + "/basic-og-once-lang",
		});

		const requests: string[] = [];
		let responses = 0;

		this.irc.config.browser.language = "first language";
		link(this.irc, this.network.channels[0], message, message.text);

		setTimeout(() => {
			this.irc.config.browser.language = "second language";
			link(this.irc, this.network.channels[0], message, message.text);
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
				this.irc.removeListener("msg:preview", cb);
				expect(requests).to.deep.equal(["first language", "second language"]);
				done();
			}
		};

		this.irc.on("msg:preview", cb);
	});
});
