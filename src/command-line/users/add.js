"use strict";

const colors = require("colors/safe");
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

		if (users === undefined) { // There was an error, already logged
			return;
		}

		if (users.indexOf(name) !== -1) {
			log.error(`User ${colors.bold(name)} already exists.`);
			return;
		}

		log.prompt({
			text: "Enter password:",
			silent: true,
		}, (err, password) => {
			if (!password) {
				log.error("Password cannot be empty.");
				return;
			}

			if (err) {
				return;
			}

			log.prompt({
				text: "Save logs to disk?",
				default: "yes",
			}, (err2, enableLog) => {
				if (err2) {
					return;
				}

				log.prompt({
					text: "Admin?",
					default: "no",
				}, (err3, isAdmin) => {
					if (err3) {
						return;
					}

					add(
						manager,
						name,
						password,
						isAdmin.charAt(0).toLowerCase() === "y",
						enableLog.charAt(0).toLowerCase() === "y"
					);
				});
			});
		});
	});

function add(manager, name, password, isAdmin, enableLog) {
	var hash = Helper.password.hash(password);
	manager.addUser(name, hash, isAdmin ? "admin" : "", enableLog);

	log.info(`${isAdmin ? "Admin" : "User"} ${colors.bold(name)} created.`);
	log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
}
