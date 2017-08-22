"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");
const Utils = require("./utils");

program
	.command("remove <name>")
	.description("Remove an existing user")
	.on("--help", Utils.extraHelp)
	.action(function(name) {
		var manager = new ClientManager();
		if (manager.removeUser(name)) {
			log.info(`User ${colors.bold(name)} removed.`);
		} else {
			log.error(`User ${colors.bold(name)} does not exist.`);
		}
	});
