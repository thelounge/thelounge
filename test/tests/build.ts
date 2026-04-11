import {expect} from "vitest";
import fs from "fs";
import path from "path";

describe("public folder", function () {
	const publicFolder = path.join(process.cwd(), "public");

	it("font awesome files are bundled", function () {
		const assets = fs.readdirSync(path.join(publicFolder, "assets"));
		expect(assets.some((f: string) => f.includes("fa-solid-900") && f.endsWith(".woff2"))).to
			.be.true;
	});

	it("files in root folder are copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "favicon.ico"))).to.be.true;
		expect(fs.existsSync(path.join(publicFolder, "robots.txt"))).to.be.true;
		expect(fs.existsSync(path.join(publicFolder, "service-worker.js"))).to.be.true;
		expect(fs.existsSync(path.join(publicFolder, "thelounge.webmanifest"))).to.be.true;
	});

	it("audio files are copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "audio", "pop.wav"))).to.be.true;
	});

	it("index HTML is built with Vite-injected assets", function () {
		expect(fs.existsSync(path.join(publicFolder, "index.html"))).to.be.true;

		const html = fs.readFileSync(path.join(publicFolder, "index.html"), "utf-8");
		expect(html).to.include("<!--thelounge-theme-->");
		expect(html).to.include('<script type="module"');
	});

	it("javascript assets are built", function () {
		expect(fs.existsSync(path.join(publicFolder, "assets"))).to.be.true;

		const assets = fs.readdirSync(path.join(publicFolder, "assets"));
		expect(assets.some((f: string) => f.endsWith(".js"))).to.be.true;
	});

	it("style files are built", function () {
		expect(fs.existsSync(path.join(publicFolder, "themes", "default.css"))).to.be.true;
		expect(fs.existsSync(path.join(publicFolder, "themes", "morning.css"))).to.be.true;

		const assets = fs.readdirSync(path.join(publicFolder, "assets"));
		expect(assets.some((f: string) => f.endsWith(".css"))).to.be.true;
	});

	it("loading-error-handlers.js is copied", function () {
		expect(fs.existsSync(path.join(publicFolder, "js", "loading-error-handlers.js"))).to.be
			.true;
	});

	it("service worker has cacheName set", function () {
		const contents = fs.readFileSync(path.join(publicFolder, "service-worker.js"), "utf8");
		expect(contents.includes("const cacheName")).to.be.true;
		expect(contents.includes("__HASH__")).to.be.false;
	});
});
