#!/usr/bin/env node

"use strict";

process.chdir(__dirname);

// Perform node version check before loading any other files or modules
// Doing this check as soon as possible allows us to avoid ES6 parser errors or other issues
var pkg = require("./package.json");
if (!require("semver").satisfies(process.version, pkg.engines.node)) {
	/* eslint-disable no-console */
	console.error("=== WARNING!");
	console.error("=== The oldest supported Node.js version is", pkg.engines.node);
	console.error("=== We strongly encourage you to upgrade, see https://nodejs.org/en/download/package-manager/ for more details\n");
	/* eslint-enable no-console */
}

require("./src/command-line");
