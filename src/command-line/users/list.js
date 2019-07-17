"use strict";

const log = require("../../log");
const colors = require("chalk");
const program = require("commander");
const fs = require("fs");
const Helper = require("../../helper");
const Utils = require("../utils");

program
	.command("list")
	.description("List all users")
	.on("--help", Utils.extraHelp)
	.action(function() {
		if (!fs.existsSync(Helper.getUsersPath())) {
			log.error(`${Helper.getUsersPath()} does not exist.`);
			return;
		}

		const ClientManager = require("../../clientManager");
		const users = new ClientManager().getUsers();

		if (users === undefined) {
			// There was an error, already logged
			return;
		}

		if (users.length > 0) {
			log.info("Users:");
			users.forEach((user, i) => {
				log.info(`${i + 1}. ${colors.bold(user)}`);
			});
		} else {
			log.info(
				`There are currently no users. Create one with ${colors.bold(
					"thelounge add <name>"
				)}.`
			);
		}
	});
