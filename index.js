#!/usr/bin/env node

"use strict";

process.chdir(__dirname);

// Perform node version check before loading any other files or modules
// Doing this check as soon as possible allows us to avoid ES6 parser errors or
// other issues
// Try to display warnings nicely, but gracefully degrade if anything goes wrong
var pkg = require("./package.json");
if (!require("semver").satisfies(process.version, pkg.engines.node)) {
	let colors;
	let log;

	try {
		colors = require("colors/safe");
	} catch (e) {
		colors = {};
		colors.green = colors.red = colors.bold = (x) => x;
	}

	try {
		log = require("./src/log");
	} catch (e) {
		log = {};
		log.warn = (msg) => console.error(`[WARN] ${msg}`); // eslint-disable-line no-console
	}

	log.warn(`The Lounge requires Node.js ${colors.green(pkg.engines.node)} (current version: ${colors.red(process.version)})`);
	log.warn(colors.bold("We strongly encourage you to upgrade Node.js"));
	log.warn("See https://nodejs.org/en/download/package-manager/ for more details");
}

require("./src/command-line");
