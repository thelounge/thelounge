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
		const packagesConfig = path.join(packagesPath, "package.json");
		const packageWasNotInstalled = `${colors.green(packageName)} was not installed.`;

		if (!fs.existsSync(packagesConfig)) {
			log.warn(packageWasNotInstalled);
			process.exit(1);
		}

		const npm = process.platform === "win32" ? "npm.cmd" : "npm";

		const errorHandler = (error) => {
			log.error(
				`Failed to uninstall ${colors.green(packageName)}. ` +
				`${typeof x === "number" ? "Exit code" : "Error"}: ${error}`
			);
			process.exit(1);
		};

		// First, we check if the package is installed with `npm list`
		const list = child.spawn(
			npm,
			[
				"list",
				"--depth",
				"0",
				"--prefix",
				packagesPath,
				packageName,
			],
			{
				// This is the same as `"inherit"` except:
				// - `process.stdout` is piped so we can test if the output mentions the
				//   package was found
				// - `process.stderr` is ignored to silence `npm ERR! extraneous` errors
				stdio: [process.stdin, "pipe", "ignore"],
			}
		);

		list.stdout.on("data", (data) => {
			// If the package name does not appear in stdout, it means it was not
			// installed. We cannot rely on exit code because `npm ERR! extraneous`
			// causes a status of 1 even if package exists.
			if (!data.toString().includes(packageName)) {
				log.warn(packageWasNotInstalled);
				process.exit(1);
			}
		});

		list.on("error", errorHandler);

		list.on("close", () => {
			// If we get there, it means the package exists, so uninstall
			const uninstall = child.spawn(
				npm,
				[
					"uninstall",
					"--save",
					"--no-progress",
					"--prefix",
					packagesPath,
					packageName,
				],
				{
					// This is the same as `"inherit"` except `process.stdout` is silenced
					stdio: [process.stdin, "ignore", process.stderr],
				}
			);

			uninstall.on("error", errorHandler);

			uninstall.on("close", (code) => {
				if (code !== 0) {
					errorHandler(code);
				}

				log.info(`${colors.green(packageName)} has been successfully uninstalled.`);
			});
		});
	});
