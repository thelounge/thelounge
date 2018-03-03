"use strict";

const _ = require("lodash");
const colors = require("chalk");
const fs = require("fs");
const Helper = require("../helper");
const path = require("path");

let home;

class Utils {
	static extraHelp() {
		[
			"",
			"",
			"  Environment variable:",
			"",
			`    THELOUNGE_HOME   Path for all configuration files and folders. Defaults to ${colors.green(Helper.expandHome(Utils.defaultHome()))}.`,
			"",
		].forEach((e) => log.raw(e));
	}

	// TODO: Remove in a couple of releases
	static checkOldHome() {
		const currentHome = Helper.getHomePath();
		const oldHome = currentHome.replace(/\.thelounge$/, ".lounge");

		if (currentHome === oldHome || !fs.existsSync(oldHome)) {
			return;
		}

		console.log(); // eslint-disable-line no-console
		log.warn(`Folder ${colors.bold.red(oldHome)} still exists.`);
		log.warn(`In v3, we renamed the default configuration folder to ${colors.bold.green(".thelounge")} for consistency.`);
		log.warn(`You might want to rename the folder from ${colors.bold.red(".lounge")} to ${colors.bold.green(".thelounge")} to keep existing configuration.`);
		log.warn("Make sure to look at the release notes to see other breaking changes.");
		console.log(); // eslint-disable-line no-console
	}

	static defaultHome() {
		if (home) {
			return home;
		}

		const distConfig = path.resolve(path.join(
			__dirname,
			"..",
			"..",
			".thelounge_home"
		));

		home = fs.readFileSync(distConfig, "utf-8").trim();

		return home;
	}

	// Parses CLI options such as `-c public=true`, `-c debug.raw=true`, etc.
	static parseConfigOptions(val, memo) {
		// Invalid option that is not of format `key=value`, do nothing
		if (!val.includes("=")) {
			return memo;
		}

		const parseValue = (value) => {
			if (value === "true") {
				return true;
			} else if (value === "false") {
				return false;
			} else if (value === "undefined") {
				return undefined;
			} else if (value === "null") {
				return null;
			} else if (/^\[.*\]$/.test(value)) { // Arrays
				// Supporting arrays `[a,b]` and `[a, b]`
				const array = value.slice(1, -1).split(/,\s*/);

				// If [] is given, it will be parsed as `[ "" ]`, so treat this as empty
				if (array.length === 1 && array[0] === "") {
					return [];
				}

				return array.map(parseValue); // Re-parses all values of the array
			}

			return value;
		};

		// First time the option is parsed, memo is not set
		if (memo === undefined) {
			memo = {};
		}

		// Note: If passed `-c foo="bar=42"` (with single or double quotes), `val`
		//       will always be passed as `foo=bar=42`, never with quotes.
		const position = val.indexOf("="); // Only split on the first = found
		const key = val.slice(0, position);
		const value = val.slice(position + 1);
		const parsedValue = parseValue(value);

		if (_.has(memo, key)) {
			log.warn(`Configuration key ${colors.bold(key)} was already specified, ignoring...`);
		} else {
			memo = _.set(memo, key, parsedValue);
		}

		return memo;
	}
}

module.exports = Utils;
