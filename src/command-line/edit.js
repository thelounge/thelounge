"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var child = require("child_process");
var colors = require("colors/safe");
var Helper = require("../helper");

program
	.command("edit <name>")
	.description(`Edit user file located at ${colors.green(Helper.getUserConfigPath("<name>"))}.`)
	.action(function(name) {
		let manager = new ClientManager();
		manager.getUsers()
			.then((users)=> {
				if (!(name in users)) {
					return Promise.reject(new Error(`User ${colors.bold(name)} does not exist.`));
				}
				var child_spawn = child.spawn(
					process.env.EDITOR || "vi",
					[Helper.getUserConfigPath(name)],
					{stdio: "inherit"}
				);
				child_spawn.on("error", function() {
					log.error(`Unable to open ${colors.green(Helper.getUserConfigPath(name))}. ${colors.bold("$EDITOR")} is not set, and ${colors.bold("vi")} was not found.`);
				});
			})
			.catch((err)=>{
				log.error(`Error editing user ${colors.bold(name)}.`, err.message);
			});
	});
