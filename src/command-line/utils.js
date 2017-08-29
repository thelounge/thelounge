"use strict";

const colors = require("colors/safe");
const fs = require("fs");
const path = require("path");

let loungeHome;

class Utils {
	static extraHelp() {
		[
			"",
			"",
			"  Environment variable:",
			"",
			`    LOUNGE_HOME   Path for all configuration files and folders. Defaults to ${colors.green(Utils.defaultLoungeHome())}.`,
			"",
		].forEach((e) => console.log(e));
	}

	static defaultLoungeHome() {
		if (loungeHome) {
			return loungeHome;
		}
		const distConfig = path.resolve(path.join(
			__dirname,
			"..",
			"..",
			".lounge_home"
		));

		loungeHome = fs.readFileSync(distConfig, "utf-8").trim();

		return loungeHome;
	}
}

module.exports = Utils;
