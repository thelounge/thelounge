"use strict";

var fs = require("fs-extra");

var srcDir = "./node_modules/font-awesome/fonts/";
var destDir = "./client/fonts/";
var fonts = [
	"fontawesome-webfont.eot",
	"fontawesome-webfont.svg",
	"fontawesome-webfont.ttf",
	"fontawesome-webfont.woff",
	"fontawesome-webfont.woff2"
];

fs.ensureDir(destDir, function (err) {
	if (err) {
		console.error(err);
	}

	fonts.forEach(function (font) {
		fs.copy(srcDir + font, destDir + font, function (err) {
			if (err) {
				console.error(err);
			} else {
				console.log(font + " successfully installed.");
			}
		});
	});
});
