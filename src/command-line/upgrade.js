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
		const packagesConfig = path.join(Helper.getPackagesPath(), "package.json");
		const packagesList = JSON.parse(fs.readFileSync(packagesConfig), "utf-8").dependencies;
		const argsList = ["upgrade", "--latest"];

		let count = 0;

		if (!Object.entries(packagesList).length) {
			log.warn("There are no packages installed.");
			return;
		}

		// If a package names are supplied, check they exist
		if (packages.length) {
			log.info("Upgrading the following packages:");
			packages.forEach((p) => {
				log.info(`- ${colors.green(p)}`);

				if (Object.prototype.hasOwnProperty.call(packagesList, p)) {
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

		return Utils.executeYarnCommand(...argsList)
			.then(() => {
				log.info("Package(s) have been successfully upgraded.");
			})
			.catch((code) => {
				log.error(`Failed to upgrade package(s). Exit code ${code}`);
				process.exit(1);
			});
	});
