"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");
const Utils = require("./utils");

program
	.command("list")
	.description("List all users")
	.on("--help", Utils.extraHelp)
	.action(function() {
		var users = new ClientManager().getUsers();
		if (!users.length) {
			log.info(`There are currently no users. Create one with ${colors.bold("lounge add <name>")}.`);
		} else {
			log.info("Users:");
			for (var i = 0; i < users.length; i++) {
				log.info(`${i + 1}. ${colors.bold(users[i])}`);
			}
		}
	});
