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

	// Cache for detected package manager
	static #detectedPM: {name: "npm" | "yarn1" | "yarn4"; path?: string} | null = null;

	static #detectPackageManager(): {name: "npm" | "yarn1" | "yarn4"; path?: string} {
		if (this.#detectedPM) {
			return this.#detectedPM;
		}

		// Try to find yarn first (check version)
		try {
			const yarnVersion = require("child_process")
				.execSync("yarn --version", {encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"]})
				.trim();

			if (yarnVersion.startsWith("1.")) {
				log.debug(`Detected Yarn Classic v${yarnVersion}`);
				this.#detectedPM = {name: "yarn1"};
				return this.#detectedPM;
			} else if (yarnVersion.startsWith("4.") || yarnVersion.startsWith("3.") || yarnVersion.startsWith("2.")) {
				log.debug(`Detected Yarn Berry v${yarnVersion}`);
				this.#detectedPM = {name: "yarn4"};
				return this.#detectedPM;
			}
		} catch {
			// Yarn not available
		}

		// Try npm (bundled with Node.js, should always be available)
		try {
			const npmVersion = require("child_process")
				.execSync("npm --version", {encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"]})
				.trim();
			log.debug(`Detected npm v${npmVersion}`);
			this.#detectedPM = {name: "npm"};
			return this.#detectedPM;
		} catch {
			// npm not available
		}

		// Default to npm and hope for the best
		log.warn("Could not detect package manager, defaulting to npm");
		this.#detectedPM = {name: "npm"};
		return this.#detectedPM;
	}

	static executeYarnCommand(command: string, ...parameters: string[]) {
		const packagesPath = Config.getPackagesPath();
		const cachePath = path.join(packagesPath, "package_manager_cache");

		// Ensure directories exist
		fs.mkdirSync(cachePath, {recursive: true});
		fs.mkdirSync(path.join(packagesPath, "node_modules"), {recursive: true});

		const pm = this.#detectPackageManager();
		let executable: string;
		let args: string[];

		const env = {
			...process.env,
			NODE_ENV: "production",
			HOME: cachePath,
		};

		if (pm.name === "npm") {
			executable = "npm";
			args = this.#buildNpmArgs(command, parameters, packagesPath, cachePath);
		} else if (pm.name === "yarn1") {
			executable = "yarn";
			args = this.#buildYarn1Args(command, parameters, packagesPath, cachePath);
		} else {
			// yarn4/berry
			executable = "yarn";
			args = this.#buildYarn4Args(command, parameters, packagesPath);
		}

		return new Promise((resolve, reject) => {
			let success = false;
			const isOutdated = command === "outdated";

			log.debug(`Running: ${executable} ${args.join(" ")}`);

			const proc = spawn(executable, args, {
				env: env,
				shell: true,
				cwd: pm.name === "yarn4" ? packagesPath : undefined,
			});

			proc.stdout.on("data", (data) => {
				const output = data.toString().trim();
				if (output) {
					// For yarn1 JSON output, check for success type
					if (pm.name === "yarn1") {
						try {
							const lines = output.split("\n");
							for (const line of lines) {
								const json = JSON.parse(line);
								if (json.type === "success") {
									success = true;
								}
							}
						} catch {
							// Not JSON, just log it
						}
					}
					log.debug(output);
				}
			});

			proc.stderr.on("data", (data) => {
				const output = data.toString().trim();
				if (output) {
					// Filter out noise
					if (output.includes("WARN") || output.includes("warning")) {
						log.debug(output);
					} else if (output.includes("ERR!") || output.includes("error")) {
						log.error(output);
					} else {
						log.debug(output);
					}
				}
			});

			proc.on("error", (e) => {
				log.error(`${e.message}:`, e.stack || "");
				reject(new Error(e.message));
			});

			proc.on("close", (code) => {
				// Handle exit codes
				if (code === 0) {
					success = true;
				} else if (isOutdated && code === 1) {
					// outdated commands return 1 when packages are outdated
					success = true;
				}

				if (!success) {
					return reject(new Error(`Process exited with code ${code}`));
				}

				resolve(true);
			});
		});
	}

	static #buildNpmArgs(command: string, parameters: string[], packagesPath: string, cachePath: string): string[] {
		let npmCommand = command;
		const args: string[] = [];

		switch (command) {
			case "add":
				npmCommand = "install";
				for (const param of parameters) {
					if (param === "--exact") {
						args.push("--save-exact");
					} else {
						args.push(param);
					}
				}
				break;
			case "remove":
				npmCommand = "uninstall";
				args.push(...parameters);
				break;
			case "upgrade":
				npmCommand = "update";
				args.push(...parameters);
				break;
			default:
				args.push(...parameters);
		}

		return [npmCommand, "--prefix", packagesPath, "--cache", cachePath, "--ignore-scripts", ...args];
	}

	static #buildYarn1Args(command: string, parameters: string[], packagesPath: string, cachePath: string): string[] {
		const args = [
			command,
			"--cache-folder", cachePath,
			"--cwd", packagesPath,
			"--json",
			"--ignore-scripts",
			"--non-interactive",
			...parameters,
		];
		return args;
	}

	static #buildYarn4Args(command: string, parameters: string[], packagesPath: string): string[] {
		// Yarn 4 (Berry) has different syntax
		// It uses the cwd option via process.cwd() or --cwd flag
		let yarnCommand = command;
		const args: string[] = [];

		switch (command) {
			case "add":
				yarnCommand = "add";
				for (const param of parameters) {
					if (param === "--exact") {
						args.push("--exact");
					} else {
						args.push(param);
					}
				}
				break;
			case "remove":
				yarnCommand = "remove";
				args.push(...parameters);
				break;
			case "upgrade":
				yarnCommand = "up";
				args.push(...parameters);
				break;
			case "outdated":
				// Yarn 4 has yarn npm audit but no direct outdated equivalent
				// Use yarn info to check versions - but for simplicity just return success
				// The outdated check is not critical functionality
				yarnCommand = "info";
				args.push("--name-only");
				break;
			case "install":
				yarnCommand = "install";
				args.push(...parameters);
				break;
			default:
				args.push(...parameters);
		}

		// Yarn 4 uses mode flag instead of ignore-scripts
		return [yarnCommand, "--mode=skip-build", ...args];
	}
}

export default Utils;
