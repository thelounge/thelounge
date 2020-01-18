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
		})
			.then((json) => {
				if (!("thelounge" in json)) {
					log.error(
						`${colors.red(
							json.name + " v" + json.version
						)} does not have The Lounge metadata.`
					);

					process.exit(1);
				}

				log.info(`Installing ${colors.green(json.name + " v" + json.version)}...`);

				return Utils.executeYarnCommand("add", "--exact", `${json.name}@${json.version}`)
					.then(() => {
						log.info(
							`${colors.green(
								json.name + " v" + json.version
							)} has been successfully installed.`
						);
					})
					.catch((code) => {
						throw `Failed to install ${colors.green(
							json.name + " v" + json.version
						)}. Exit code: ${code}`;
					});
			})
			.catch((e) => {
				log.error(`${e}`);
				process.exit(1);
			});
	});
