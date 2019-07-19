"use strict";

const program = require("commander");
const Utils = require("./utils");
const packageManager = require("../plugins/packages");
const log = require("../log");

program
	.command("outdated")
	.description("Check for any outdated packages")
	.on("--help", Utils.extraHelp)
	.action(async () => {
		log.info("Checking for outdated packages");

		await packageManager
			.outdated(0)
			.then((outdated) => {
				if (outdated) {
					log.info("There are outdated packages");
				} else {
					log.info("No outdated packages");
				}
			})
			.catch(() => {
				log.error("Error finding outdated packages.");
			});
	});
