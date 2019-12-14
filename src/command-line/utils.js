"use strict";

const _ = require("lodash");
const log = require("../log");
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
			`    THELOUNGE_HOME   Path for all configuration files and folders. Defaults to ${colors.green(
				Helper.expandHome(Utils.defaultHome())
			)}.`,
			"",
		].forEach((e) => log.raw(e));
	}

	static defaultHome() {
		if (home) {
			return home;
		}

		const distConfig = path.resolve(path.join(__dirname, "..", "..", ".thelounge_home"));

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
			} else if (/^-?[0-9]+$/.test(value)) {
				// Numbers like port
				value = parseInt(value, 10);
			} else if (/^\[.*\]$/.test(value)) {
				// Arrays
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

	static executeYarnCommand(command, ...parameters) {
		const yarn = require.resolve("yarn/bin/yarn.js");
		const packagesPath = Helper.getPackagesPath();
		const cachePath = path.join(packagesPath, "package_manager_cache");

		const staticParameters = [
			"--cache-folder",
			cachePath,
			"--cwd",
			packagesPath,
			"--json",
			"--ignore-scripts",
			"--non-interactive",
		];

		const env = {
			// We only ever operate in production mode
			NODE_ENV: "production",

			// If The Lounge runs from a user that does not have a home directory,
			// yarn may fail when it tries to read certain folders,
			// we give it an existing folder so the reads do not throw a permission error.
			// Yarn uses os.homedir() to figure out the path, which internally reads
			// from the $HOME env on unix. On Windows it uses $USERPROFILE, but
			// the user folder should always exist on Windows, so we don't set it.
			HOME: cachePath,
		};

		return new Promise((resolve, reject) => {
			let success = false;
			const add = require("child_process").spawn(
				process.execPath,
				[yarn, command, ...staticParameters, ...parameters],
				{env: env}
			);

			add.stdout.on("data", (data) => {
				data.toString()
					.trim()
					.split("\n")
					.forEach((line) => {
						line = JSON.parse(line);

						if (line.type === "success") {
							success = true;
						}
					});
			});

			add.stderr.on("data", (data) => {
				data.toString()
					.trim()
					.split("\n")
					.forEach((line) => {
						const json = JSON.parse(line);

						if (json.type === "error") {
							log.error(json.data);
						}
					});
			});

			add.on("error", (e) => {
				log.error(`${e}`);
				process.exit(1);
			});

			add.on("close", (code) => {
				if (!success || code !== 0) {
					return reject(code);
				}

				resolve();
			});
		});
	}
}

module.exports = Utils;
