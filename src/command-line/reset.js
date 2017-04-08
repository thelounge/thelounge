"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");
var Helper = require("../helper");

program
	.command("reset <name>")
	.description("Reset user password")
	.action((name) => {
		let manager = new ClientManager();

		manager.getUsersPromise()
			.then((data) => {
				let users = data.users;
				if (users.indexOf(name) === -1) {
					throw new Error(`User ${colors.bold(name)} does not exist.`);
				}
				log.prompt({
					text: "Enter new password:",
					silent: true
				}, (err, password) => {
					if (err) {
						throw new Error("Error typing new password.");
					}
					let user = {};
					user.password = Helper.password.hash(password);
					user.token = null; // Will be regenerated when the user is loaded
					manager.updateUserPromise({
						name: name,
						opts: user
					})
						.then(()=>{
							log.info(`Successfully reset password for ${colors.bold(name)}.`);
						})
						.catch((err2)=>{
							log.error(`Errors changing user ${colors.bold(name)} password.`, err2.message);
						});
				});
			})
			.catch(
				(err)=>{
					log.error(`Error changing user ${colors.bold(name)} password.`, err.message);
				});
	});
