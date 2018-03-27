"use strict";

const colors = require("chalk");
const path = require("path");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("uninstall <package>")
	.description("Uninstall a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(function(packageName) {
		const fs = require("fs");
		const child = require("child_process");

		if (!fs.existsSync(Helper.getConfigPath())) {
			log.error(`${Helper.getConfigPath()} does not exist.`);
			return;
		}

		log.info(`Uninstalling ${colors.green(packageName)}...`);

		const packagesPath = Helper.getPackagesPath();
		const packagesConfig = path.join(packagesPath, "package.json");
		const packageWasNotInstalled = `${colors.green(packageName)} was not installed.`;

		if (!fs.existsSync(packagesConfig)) {
			log.warn(packageWasNotInstalled);
			process.exit(1);
		}

		const packages = JSON.parse(fs.readFileSync(packagesConfig, "utf-8"));

		if (!packages.dependencies || !packages.dependencies.hasOwnProperty(packageName)) {
			log.warn(packageWasNotInstalled);
			process.exit(1);
		}

		const errorHandler = (error) => {
			log.error(
				`Failed to uninstall ${colors.green(packageName)}. ` +
				`${typeof x === "number" ? "Exit code" : "Error"}: ${error}`
			);
			process.exit(1);
		};

		const yarn = path.join(
			__dirname,
			"..",
			"..",
			"node_modules",
			"yarn",
			"bin",
			"yarn.js"
		);

		let success = false;
		const remove = child.spawn(
			process.execPath,
			[
				yarn,
				"remove",
				"--json",
				"--ignore-scripts",
				"--non-interactive",
				"--cwd",
				packagesPath,
				packageName,
			]
		);

		remove.stdout.on("data", (data) => {
			data.toString().trim().split("\n").forEach((line) => {
				line = JSON.parse(line);

				if (line.type === "success") {
					success = true;
				}
			});
		});

		remove.stderr.on("data", (data) => {
			log.error(data.toString());
		});

		remove.on("error", errorHandler);

		remove.on("close", (code) => {
			if (!success || code !== 0) {
				return errorHandler(code);
			}

			log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
		});
	});
