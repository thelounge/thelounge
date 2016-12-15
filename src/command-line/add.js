"use strict";

var ClientManager = new require("../clientManager");
var colors = require("colors/safe");
var program = require("commander");
var Helper = require("../helper");

program
	.command("add <name>")
	.description("Add a new user")
	.action(function(name) {
		var manager = new ClientManager();
		var users = manager.getUsers();
		if (users.indexOf(name) !== -1) {
			log.error(`User ${colors.bold(name)} already exists.`);
			return;
		}
		require("read")({
			prompt: log.rawInfo("Enter password: "),
			silent: true
		}, function(err, password) {
			if (!password) {
				log.error("Password cannot be empty.");
				return;
			}
			if (!err) {
				add(manager, name, password);
			}
		});
	});

function add(manager, name, password) {
	var hash = Helper.password.hash(password);
	manager.addUser(
		name,
		hash
	);

	log.info(`User ${colors.bold(name)} created.`);
	log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
}
