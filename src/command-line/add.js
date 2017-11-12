"use strict";

const colors = require("colors/safe");
const program = require("commander");
const fs = require("fs");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("add <name>")
	.description("Add/Update user")
	.on("--help", Utils.extraHelp)
	.action(function(name, options) {
		if (!fs.existsSync(Helper.USERS_PATH)) {
			log.error(`${Helper.USERS_PATH} does not exist.`);
			return;
		}

		const ClientManager = require("../clientManager");

		if (Helper.config.public) {
			log.warn(`Users have no effect in ${colors.bold("public")} mode.`);
		}

		const manager = new ClientManager();
		const users = manager.getUsers();

		if (users === undefined) { // There was an error, already logged
			return;
		}

		if (options.setPassword === undefined) {
			log.prompt({
				text: "Enter password:",
				silent: true
			}, function(err, password) {
				if (!password) {
					log.error("Password cannot be empty.");
					return;
				}
				if (!err) {
					log.prompt({
						text: "Save logs to disk?",
						default: "yes"
					}, function(err2, enableLog) {
						if (!err2) {
							add(
								manager,
								name,
								password,
								enableLog.charAt(0).toLowerCase() === "y"
							);
						}
					});
				}
			});
		} else {
			var password = options.setPassword;
			add(
				manager,
				name,
				password,
				false
			);
		}
	});

function add(manager, name, password, enableLog) {
	var hash = Helper.password.hash(password);
	manager.addUser(name, hash, enableLog);

	log.info(`User ${colors.bold(name)} created.`);
	log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
}
