"use strict";

const log = require("../log");
const colors = require("chalk");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("upgrade [packages...]")
	.description("Upgrade installed themes and packages to their latest versions.")
	.on("--help", Utils.extraHelp)
	.action(function(packages) {
		const fs = require("fs");
		const path = require("path");

		// Get paths to the location of packages directory
		const packagesPath = Helper.getPackagesPath();
		const packagesConfig = path.join(packagesPath, "package.json");
		const packagesList = JSON.parse(fs.readFileSync(packagesConfig)).dependencies;
		const argsList = [
			"upgrade",
			"--production",
			"--latest",
		];

		let count = 0;

		// Check if the configuration file exists
		if (!fs.existsSync(packagesConfig)) {
			log.warn("There are no packages installed.");
			return;
		}

		// If a package names are supplied, check they exist
		if (packages.length) {
			log.info("Upgrading the following packages:");
			packages.forEach((p) => {
				log.info(`- ${colors.green(p)}`);

				if (packagesList.hasOwnProperty(p)) {
					argsList.push(p);
					count++;
				} else {
					log.error(`${colors.green(p)} is not installed.`);
				}
			});
		} else {
			log.info("Upgrading all packages...");
		}

		if (count === 0 && packages.length) {
			log.warn("There are not any packages to upgrade.");
			return;
		}

		return Utils.executeYarnCommand(...argsList).then(() => {
			log.info("Package(s) have been successfully upgraded.");
		}).catch((code) => {
			throw `Failed to upgrade package(s). Exit code ${code}`;
		});
	});
