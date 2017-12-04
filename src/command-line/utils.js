"use strict";

const colors = require("colors/safe");
const fs = require("fs");
const path = require("path");

let home;

class Utils {
	static extraHelp() {
		[
			"",
			"",
			"  Environment variable:",
			"",
			`    THELOUNGE_HOME   Path for all configuration files and folders. Defaults to ${colors.green(Utils.defaultHome())}.`,
			"",
		].forEach((e) => console.log(e)); // eslint-disable-line no-console
	}

	static defaultHome() {
		if (home) {
			return home;
		}

		let distConfig;

		// TODO: Remove this section when releasing The Lounge v3
		const deprecatedDistConfig = path.resolve(path.join(
			__dirname,
			"..",
			"..",
			".lounge_home"
		));
		if (fs.existsSync(deprecatedDistConfig)) {
			log.warn(`${colors.green(".lounge_home")} is ${colors.bold("deprecated")} and will be ignored as of The Lounge v3.`);
			log.warn(`Use ${colors.green(".thelounge_home")} instead.`);

			distConfig = deprecatedDistConfig;
		} else {
			distConfig = path.resolve(path.join(
				__dirname,
				"..",
				"..",
				".thelounge_home"
			));
		}

		home = fs.readFileSync(distConfig, "utf-8").trim();

		return home;
	}
}

module.exports = Utils;
