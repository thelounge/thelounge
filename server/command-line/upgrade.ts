import log from "../log.js";
import colors from "chalk";
import {Command} from "commander";
import Config from "../config.js";
import Utils from "./utils.js";
import fs from "node:fs";
import path from "node:path";

const program = new Command("upgrade");
program
	.arguments("[packages...]")
	.description("Upgrade installed themes and packages to their latest versions")
	.on("--help", Utils.extraHelp)
	.action(function (packages) {
		// Get paths to the location of packages directory
		const packagesConfig = path.join(Config.getPackagesPath(), "package.json");
		const packagesList = JSON.parse(fs.readFileSync(packagesConfig, "utf-8")).dependencies;
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

		const command = argsList.shift();
		const params = argsList;

		if (!command) {
			return;
		}

		return Utils.executeYarnCommand(command, ...params)
			.then(() => {
				log.info("Package(s) have been successfully upgraded.");
			})
			.catch((code) => {
				log.error(`Failed to upgrade package(s). Exit code ${String(code)}`);
				process.exit(1);
			});
	});

export default program;
