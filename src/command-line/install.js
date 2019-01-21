"use strict";

const log = require("../log");
const colors = require("chalk");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("install <package>")
	.description("Install a theme or a package")
	.on("--help", Utils.extraHelp)
	.action(function(packageName) {
		const fs = require("fs");
		const fsextra = require("fs-extra");
		const path = require("path");
		const packageJson = require("package-json");

		if (!fs.existsSync(Helper.getConfigPath())) {
			log.error(`${Helper.getConfigPath()} does not exist.`);
			return;
		}

		log.info("Retrieving information about the package...");

		const split = packageName.split("@");
		packageName = split[0];
		const packageVersion = split[1] || "latest";

		packageJson(packageName, {
			fullMetadata: true,
			version: packageVersion,
		}).then((json) => {
			if (!("thelounge" in json)) {
				log.error(`${colors.red(json.name + " v" + json.version)} does not have The Lounge metadata.`);

				process.exit(1);
			}

			log.info(`Installing ${colors.green(json.name + " v" + json.version)}...`);

			const packagesPath = Helper.getPackagesPath();
			const packagesConfig = path.join(packagesPath, "package.json");

			// Create node_modules folder, otherwise yarn will start walking upwards to find one
			fsextra.ensureDirSync(path.join(packagesPath, "node_modules"));

			// Create package.json with private set to true, if it doesn't exist already
			if (!fs.existsSync(packagesConfig)) {
				fs.writeFileSync(packagesConfig, JSON.stringify({
					private: true,
					description: "Packages for The Lounge. All packages in node_modules directory will be automatically loaded.",
				}, null, "\t"));
			}

			return Utils.executeYarnCommand(
				"add",
				"--production",
				"--exact",
				`${json.name}@${json.version}`
			).then(() => {
				log.info(`${colors.green(json.name + " v" + json.version)} has been successfully installed.`);
			}).catch((code) => {
				throw `Failed to install ${colors.green(json.name + " v" + json.version)}. Exit code: ${code}`;
			});
		}).catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
	});
