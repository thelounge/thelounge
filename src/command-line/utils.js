"use strict";

const colors = require("colors/safe");

class Utils {
	static extraHelp() {
		[
			"",
			"",
			"  Environment variable:",
			"",
			`    LOUNGE_HOME   Path for all configuration files and folders. Defaults to ${colors.green("~/.lounge")}.`,
			"",
		].forEach((e) => console.log(e));
	}
}

module.exports = Utils;
