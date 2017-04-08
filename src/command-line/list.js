"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");

program
	.command("list")
	.description("List all users")
	.action(() => {
		var manager = new ClientManager();
		manager.getUsersPromise()
			.then((data)=>{
				let users = data.users;
				if (!users.length) {
					log.warn("No users found.");
				} else {
					log.info("Users:");
					for (var i = 0; i < users.length; i++) {
						log.info(`${i + 1}. ${colors.bold(users[i])}`);
					}
				}
			});
	});
