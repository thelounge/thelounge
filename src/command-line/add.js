"use strict";

var ClientManager = new require("../clientManager");
var colors = require("colors/safe");
var program = require("commander");
var Helper = require("../helper");

program
	.command("add <name>")
	.description("Add a new user")
	.action(function(name) {
		let manager = new ClientManager();

		manager.getUsersPromise()
			.then((data) => {
				let users = data.users;
				if (users.indexOf(name) !== -1) {
					throw new Error(`User ${colors.bold(name)} already exists.`);
				}
				log.prompt({
					text: "Enter password:",
					silent: true
				}, (err, password) => {
					if (!password) {
						log.error("Password cannot be empty.");
						return;
					}
					if (!err) {
						log.prompt({
							text: "Save logs to disk?",
							default: "yes"
						}, (err2, enableLog) => {
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
			})
			.catch((err) => {
				log.error(`Error adding user ${colors.bold(name)}.`, err.message);
			});
	});

function add(manager, name, password, enableLog) {
	manager.addUserPromise({
		name: name,
		password: Helper.password.hash(password),
		enableLog: enableLog
	})
		.then((success) => {
			if (success) {
				log.info(`User ${colors.bold(name)} created.`);
				log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
			} else {
				log.warn(`User ${colors.bold(name)} not created.`);
			}
		});
}
