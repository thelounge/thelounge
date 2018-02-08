"use strict";

const colors = require("colors/safe");
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
		const child = require("child_process");
		const packageJson = require("package-json");

		if (!fs.existsSync(Helper.getConfigPath())) {
			log.error(`${Helper.getConfigPath()} does not exist.`);
			return;
		}

		log.info("Retrieving information about the package...");

		packageJson(packageName, {
			fullMetadata: true,
		}).then((json) => {
			if (!("thelounge" in json)) {
				log.error(`${colors.red(packageName)} does not have The Lounge metadata.`);

				process.exit(1);
			}

			log.info(`Installing ${colors.green(packageName)}...`);

			const packagesPath = Helper.getPackagesPath();
			const packagesConfig = path.join(packagesPath, "package.json");

			// Create node_modules folder, otherwise npm will start walking upwards to find one
			fsextra.ensureDirSync(path.join(packagesPath, "node_modules"));

			// Create package.json with private set to true to avoid npm warnings, if
			// it doesn't exist already
			if (!fs.existsSync(packagesConfig)) {
				fs.writeFileSync(packagesConfig, JSON.stringify({
					private: true,
					description: "Packages for The Lounge. All packages in node_modules directory will be automatically loaded.",
				}, null, "\t"));
			}

			const npm = child.spawn(
				process.platform === "win32" ? "npm.cmd" : "npm",
				[
					"install",
					"--production",
					"--save",
					"--save-exact",
					"--no-bin-links",
					"--no-package-lock",
					"--no-progress",
					"--prefix",
					packagesPath,
					packageName,
				],
				{
					// This is the same as `"inherit"` except `process.stdout` is ignored
					stdio: [process.stdin, "ignore", process.stderr],
				}
			);

			npm.on("error", (e) => {
				log.error(`${e}`);
				process.exit(1);
			});

			npm.on("close", (code) => {
				if (code !== 0) {
					log.error(`Failed to install ${colors.green(packageName)}. Exit code: ${code}`);
					return;
				}

				log.info(`${colors.green(packageName + " v" + json.version)} has been successfully installed.`);
			});
		}).catch((e) => {
			log.error(`${e}`);
			process.exit(1);
		});
	});
