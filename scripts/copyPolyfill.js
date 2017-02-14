"use strict";

var fs = require("fs-extra");
const path = require("path");

const sourcePath = path.resolve(__dirname, "../node_modules/babel-polyfill/dist/polyfill.min.js");
const targetPath = path.resolve(__dirname, "../client/js/polyfill.min.js");
fs.copy(sourcePath, targetPath, function(err) {
	if (err) {
		throw err;
	}
});
