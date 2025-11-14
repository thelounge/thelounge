import {expect} from "chai";
import fs from "fs";
import path from "path";

describe("public folder", function () {
	const publicFolder = path.join(__dirname, "..", "..", "public");

	it("font awesome files are copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "fonts", "fa-solid-900.woff"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "fonts", "fa-solid-900.woff2"))).to.equal(true);
	});

	it("files in root folder are copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "favicon.ico"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "robots.txt"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "service-worker.js"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "thelounge.webmanifest"))).to.equal(true);
	});

	it("audio files are copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "audio", "pop.wav"))).to.equal(true);
	});

	it("index HTML file is not copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "index.html"))).to.equal(false);
		expect(fs.existsSync(path.join(publicFolder, "index.html.tpl"))).to.equal(false);
	});

	it("javascript files are built", function () {
		expect(fs.existsSync(path.join(publicFolder, "js", "bundle.js"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "js", "bundle.vendor.js"))).to.equal(true);
	});

	it("style files are built", function () {
		expect(fs.existsSync(path.join(publicFolder, "css", "style.css"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "css", "style.css.map"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "themes", "default.css"))).to.equal(true);
		expect(fs.existsSync(path.join(publicFolder, "themes", "morning.css"))).to.equal(true);
	});

	it("style files contain expected content", function (done) {
		fs.readFile(path.join(publicFolder, "css", "style.css"), "utf8", function (err, contents) {
			expect(err).to.equal(null);

			expect(contents.includes("var(--body-color)")).to.equal(true);
			expect(contents.includes("url(../fonts/fa-solid-900.woff2)")).to.equal(true);
			expect(contents.includes(".tooltipped{position:relative}")).to.equal(true);
			expect(contents.includes("sourceMappingURL")).to.equal(true);

			done();
		});
	});

	it("javascript map is created", function () {
		expect(fs.existsSync(path.join(publicFolder, "js", "bundle.js.map"))).to.equal(true);
	});

	it("loading-error-handlers.js is copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "js", "loading-error-handlers.js"))).to.be
			.true;
	});

	it("service worker has cacheName set", function (done) {
		fs.readFile(path.join(publicFolder, "service-worker.js"), "utf8", function (err, contents) {
			expect(err).to.equal(null);

			expect(contents.includes("const cacheName")).to.equal(true);
			expect(contents.includes("__HASH__")).to.equal(false);

			done();
		});
	});
});
