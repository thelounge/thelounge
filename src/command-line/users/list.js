"use strict";

const log = require("../../log");
const colors = require("chalk");
const program = require("commander");
const Utils = require("../utils");

program
	.command("list")
	.description("List all users")
	.on("--help", Utils.extraHelp)
	.action(function () {
		const ClientManager = require("../../clientManager");
		const users = new ClientManager().getUsers();

		if (users === undefined) {
			// There was an error, already logged
			return;
		}

		if (users.length === 0) {
			log.info(
				`There are currently no users. Create one with ${colors.bold(
					"thelounge add <name>"
				)}.`
			);
			return;
		}

		log.info("Users:");
		users.forEach((user, i) => {
			log.info(`${i + 1}. ${colors.bold(user)}`);
		});
	});
