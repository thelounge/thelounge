"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");

program
	.command("remove <name>")
	.description("Remove an existing user")
	.action(function(name) {
		var manager = new ClientManager();
		manager.removeUser({name: name})
			.then(()=>{
				log.info(`User ${colors.bold(name)} removed.`);
			});
	});
