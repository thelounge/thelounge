"use strict";

const colors = require("colors/safe");
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
		const packagesParent = path.dirname(packagesPath);

		const npm = child.spawn(
			process.platform === "win32" ? "npm.cmd" : "npm",
			[
				"uninstall",
				"--prefix",
				packagesParent,
				packageName,
			],
			{
				stdio: "inherit",
			}
		);

		npm.on("error", (e) => {
			log.error(`${e}`);
			process.exit(1);
		});

		npm.on("close", (code) => {
			if (code !== 0) {
				log.error(`Failed to uninstall ${colors.green(packageName)}. Exit code: ${code}`);
				return;
			}

			log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
		});
	});
