"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");

program
	.command("list")
	.description("List all users")
	.action(() => {
		var manager = new ClientManager();
		manager.getUsers()
			.then((users)=>{
				if (!Object.keys(users).length) {
					log.warn("No users found.");
				} else {
					log.info("Users:");
					let i = 0;
					for (let user in users) {
						log.info(`${i + 1}. ${colors.bold(user)}`);
						i++;
					}
				}
			});
	});
