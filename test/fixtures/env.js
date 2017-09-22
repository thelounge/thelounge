"use strict";

global.log = {
	error: () => console.error.apply(console, arguments), // eslint-disable-line no-console
	warn: () => {},
	info: () => {},
	debug: () => {},
};

var home = require("path").join(__dirname, ".lounge");
require("../../src/helper").setHome(home);
