import _ from "lodash";
import log from "../log.js";
import colors from "chalk";
import fs from "node:fs";
import Helper from "../helper.js";
import Config from "../config.js";
import path from "node:path";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {getDirname} from "../path-helper.js";
let home: string;

const require = createRequire(import.meta.url);

class Utils {
	static extraHelp(this: void) {
		[
			"",
			"Environment variable:",
			`  THELOUNGE_HOME            Path for all configuration files and folders. Defaults to ${colors.green(
				Helper.expandHome(Utils.defaultHome())
			)}`,
			"",
		].forEach((e) => log.raw(e));
	}

	static defaultHome() {
		if (home) {
			return home;
		}

		const distConfig = Utils.getFileFromRelativeToRoot(".thelounge_home");

		home = fs.readFileSync(distConfig, "utf-8").trim();

		return home;
	}

	static getFileFromRelativeToRoot(...fileName: string[]) {
		const __dirname = getDirname(import.meta.url);

		// e.g. /thelounge/server/command-line/utils.ts
		if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development") {
			return path.resolve(path.join(__dirname, "..", "..", ...fileName));
		}

		// e.g. /thelounge/dist/server/command-line/utils.ts
		return path.resolve(path.join(__dirname, "..", "..", "..", ...fileName));
	}

	// Parses CLI options such as `-c public=true`, `-c debug.raw=true`, etc.
	static parseConfigOptions(this: void, val: string, memo?: Record<string, unknown>) {
		// Invalid option that is not of format `key=value`, do nothing
		if (!val.includes("=")) {
			return memo;
		}

		const parseValue = (value: string) => {
			switch (value) {
				case "true":
					return true;
				case "false":
					return false;
				case "undefined":
					return undefined;
				case "null":
					return null;
				default:
					if (/^-?[0-9]+$/.test(value)) {
						// Numbers like port
						return parseInt(value, 10);
					} else if (/^\[.*\]$/.test(value)) {
						// Arrays
						// Supporting arrays `[a,b]` and `[a, b]`
						const array = value.slice(1, -1).split(/,\s*/);

						// If [] is given, it will be parsed as `[ "" ]`, so treat this as empty
						if (array.length === 1 && array[0] === "") {
							return [];
						}

						return array.map(parseValue) as Array<Record<string, string>>; // Re-parses all values of the array
					}

					return value;
			}
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

	static executeYarnCommand(command: string, ...parameters: string[]) {
		const packagesPath = Config.getPackagesPath();
		const cachePath = path.join(packagesPath, "package_manager_cache");

		// Map yarn commands to npm commands
		let npmCommand = command;
		const npmParameters: string[] = [];

		// Convert yarn commands to npm equivalents
		switch (command) {
			case "add":
				npmCommand = "install";
				// Filter out --exact flag (npm uses --save-exact)
				for (const param of parameters) {
					if (param === "--exact") {
						npmParameters.push("--save-exact");
					} else {
						npmParameters.push(param);
					}
				}
				break;
			case "outdated":
				npmCommand = "outdated";
				// npm outdated doesn't need --latest flag
				for (const param of parameters) {
					if (param !== "--latest" && param !== "--production") {
						npmParameters.push(param);
					}
				}
				break;
			case "remove":
				npmCommand = "uninstall";
				npmParameters.push(...parameters);
				break;
			case "upgrade":
				npmCommand = "update";
				npmParameters.push(...parameters);
				break;
			case "install":
				npmCommand = "install";
				npmParameters.push(...parameters);
				break;
			default:
				npmParameters.push(...parameters);
		}

		const staticParameters = [
			"--prefix",
			packagesPath,
			"--cache",
			cachePath,
			"--ignore-scripts",
		];

		const env = {
			...process.env,
			// We only ever operate in production mode
			NODE_ENV: "production",
			// Set HOME to cache path to avoid permission issues
			HOME: cachePath,
		};

		return new Promise((resolve, reject) => {
			let success = false;
			let hasOutput = false;

			const add = spawn("npm", [npmCommand, ...staticParameters, ...npmParameters], {
				env: env,
				shell: true,
			});

			add.stdout.on("data", (data) => {
				hasOutput = true;
				const output = data.toString().trim();

				if (output) {
					// npm outdated returns non-zero when packages are outdated
					// but we want to treat that as success for our purposes
					if (npmCommand === "outdated") {
						success = true;
					}

					log.debug(output);
				}
			});

			add.stderr.on("data", (data) => {
				const output = data.toString().trim();

				if (output) {
					// npm often puts warnings on stderr
					if (output.includes("WARN")) {
						log.debug(output);
					} else if (output.includes("ERR!")) {
						log.error(output);
					} else {
						log.debug(output);
					}
				}
			});

			add.on("error", (e) => {
				log.error(`${e.message}:`, e.stack || "");
				process.exit(1);
			});

			add.on("close", (code) => {
				// npm install returns 0 on success
				// npm outdated returns 1 when packages are outdated (which is expected)
				if (code === 0) {
					success = true;
				} else if (npmCommand === "outdated" && code === 1) {
					// npm outdated returns 1 when there are outdated packages
					success = true;
				}

				if (!success) {
					return reject(new Error(`Process exited with code ${code}`));
				}

				resolve(true);
			});
		});
	}
}

export default Utils;
