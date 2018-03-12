"use strict";

const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");

describe("public folder", function() {
	const publicFolder = path.join(__dirname, "..", "..", "public");

	it("font awesome files are copied", function() {
		expect(fs.existsSync(path.join(publicFolder, "fonts", "fa-solid-900.woff"))).to.be.true;
		expect(fs.existsSync(path.join(publicFolder, "fonts", "fa-solid-900.woff2"))).to.be.true;
	});

	it("index HTML file is not copied", function() {
		expect(fs.existsSync(path.join(publicFolder, "index.html"))).to.be.false;
		expect(fs.existsSync(path.join(publicFolder, "index.html.tpl"))).to.be.false;
	});

	it("javascript files are built", function() {
		expect(fs.existsSync(path.join(publicFolder, "js", "bundle.js"))).to.be.true;
		expect(fs.existsSync(path.join(publicFolder, "js", "bundle.vendor.js"))).to.be.true;
	});

	it("javascript map is created", function() {
		expect(fs.existsSync(path.join(publicFolder, "js", "bundle.js.map"))).to.be.true;
	});

	it("loading-error-handlers.js is copied", function() {
		expect(fs.existsSync(path.join(publicFolder, "js", "loading-error-handlers.js"))).to.be.true;
	});
});
