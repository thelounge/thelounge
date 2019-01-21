"use strict";

const log = require("../log");
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

		return Utils.executeYarnCommand(
			"remove",
			packageName
		).then(() => {
			log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
		}).catch((code) => {
			log.error(`Failed to uninstall ${colors.green(packageName)}. Exit code: ${code}`);
			process.exit(1);
		});
	});
