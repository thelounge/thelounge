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

		manager.getUsers()
			.then((users) => {
				if (name in users) {
					return Promise.reject(new Error(`User ${colors.bold(name)} already exists.`));
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
								manager.addUser({
									name: name,
									password: Helper.password.hash(password),
									enableLog: enableLog
								})
									.then(() => {
										log.info(`User ${colors.bold(name)} created.`);
										log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
									})
									.catch((err3) => {
										if (err3) {
											log.warn(`User ${colors.bold(name)} not created.`);
											log.warn(err3.message);
										}
									});
							}
						});
					}
				});
			})
			.catch((err) => {
				log.error(`Error adding user ${colors.bold(name)}.`, err.message);
			});
	});
