"use strict";

var ClientManager = new require("../clientManager");
var fs = require("fs");
var program = require("commander");
var colors = require("colors/safe");
var Helper = require("../helper");

program
	.command("reset <name>")
	.description("Reset user password")
	.action(function(name) {
		var users = new ClientManager().getUsers();
		if (users.indexOf(name) === -1) {
			log.error(`User ${colors.bold(name)} does not exist.`);
			return;
		}
		var file = Helper.getUserConfigPath(name);
		var user = require(file);
		log.prompt({
			text: "Enter new password:",
			silent: true
		}, function(err, password) {
			if (err) {
				return;
			}
			user.password = Helper.password.hash(password);
			user.sessions = {};
			fs.writeFileSync(
				file,
				JSON.stringify(user, null, "\t")
			);
			log.info(`Successfully reset password for ${colors.bold(name)}.`);
		});
	});
