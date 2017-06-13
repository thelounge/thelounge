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

		manager.getUsers()
			.then((users) => {
				if (!(name in users)) {
					return Promise.reject(new Error(`User ${colors.bold(name)} does not exist.`));
				}
				log.prompt({
					text: "Enter new password:",
					silent: true
				}, (err, password) => {
					if (err) {
						throw new Error("Error typing new password.");
					}
					let opts = {};
					opts.password = Helper.password.hash(password);
					opts.token = null; // Will be regenerated when the user is loaded
					manager.updateUser({
						name: name,
						opts: opts
					})
						.then(()=>{
							log.info(`Successfully reset password for ${colors.bold(name)}.`);
						})
						.catch((err2)=>{
							log.error(`Error changing user ${colors.bold(name)} password.`, err2.message);
						});
				});
			})
			.catch(
				(err)=>{
					log.error(`Error changing user ${colors.bold(name)} password.`, err.message);
				});
	});
