/* eslint-disable no-console */
"use strict";

var fs = require("fs-extra");

var srcDir = "./node_modules/font-awesome/fonts/";
var destDir = "./client/fonts/";
var fonts = [
	"fontawesome-webfont.woff",
	"fontawesome-webfont.woff2"
];

fs.ensureDir(destDir, function(dirErr) {
	if (dirErr) {
		console.error(dirErr);
	}

	fonts.forEach(function(font) {
		fs.copy(srcDir + font, destDir + font, function(err) {
			if (err) {
				console.error(err);
			} else {
				console.log(font + " successfully installed.");
			}
		});
	});
});
