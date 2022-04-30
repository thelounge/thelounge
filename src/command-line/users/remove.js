"use strict";

const log = require("../../log");
const colors = require("chalk");
const program = require("commander");
const fs = require("fs");
const Config = require("../../config");
const Utils = require("../utils");

program
	.command("remove <name>")
	.description("Remove an existing user")
	.on("--help", Utils.extraHelp)
	.action(function (name) {
		if (!fs.existsSync(Config.getUsersPath())) {
			log.error(`${Config.getUsersPath()} does not exist.`);
			return;
		}

		const ClientManager = require("../../clientManager");
		const manager = new ClientManager();

		try {
			if (manager.removeUser(name)) {
				log.info(`User ${colors.bold(name)} removed.`);
			} else {
				log.error(`User ${colors.bold(name)} does not exist.`);
			}
		} catch (e) {
			// There was an error, already logged
		}
	});
