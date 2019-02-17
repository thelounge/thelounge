"use strict";

const log = require("../../log");
const colors = require("chalk");
const program = require("commander");
const fs = require("fs");
const Helper = require("../../helper");
const Utils = require("../utils");

program
	.command("add <name>")
	.description("Add a new user")
	.on("--help", Utils.extraHelp)
	.action(function(name) {
		if (!fs.existsSync(Helper.getUsersPath())) {
			log.error(`${Helper.getUsersPath()} does not exist.`);
			return;
		}

		const ClientManager = require("../../clientManager");
		const manager = new ClientManager();
		const users = manager.getUsers();

		if (users === undefined) {
			// There was an error, already logged
			return;
		}

		if (users.includes(name)) {
			log.error(`User ${colors.bold(name)} already exists.`);
			return;
		}

		log.prompt(
			{
				text: "Enter password:",
				silent: true,
			},
			function(err, password) {
				if (!password) {
					log.error("Password cannot be empty.");
					return;
				}

				if (!err) {
					log.prompt(
						{
							text: "Save logs to disk?",
							default: "yes",
						},
						function(err2, enableLog) {
							if (!err2) {
								add(
									manager,
									name,
									password,
									enableLog.charAt(0).toLowerCase() === "y"
								);
							}
						}
					);
				}
			}
		);
	});

function add(manager, name, password, enableLog) {
	const hash = Helper.password.hash(password);
	manager.addUser(name, hash, enableLog);

	log.info(`User ${colors.bold(name)} created.`);
	log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
}
