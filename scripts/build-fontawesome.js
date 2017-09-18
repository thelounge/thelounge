"use strict";

const colors = require("colors/safe");
const fs = require("fs-extra");
const log = require("../src/log");

const srcDir = "./node_modules/font-awesome/fonts/";
const destDir = "./client/fonts/";
const fonts = [
	"fontawesome-webfont.woff",
	"fontawesome-webfont.woff2"
];

fs.ensureDir(destDir, (dirErr) => {
	if (dirErr) {
		log.error(dirErr);
	}

	fonts.forEach((font) => {
		fs.copy(srcDir + font, destDir + font, (err) => {
			if (err) {
				log.error(err);
			} else {
				log.info(colors.bold(font) + " successfully installed.");
			}
		});
	});
});
