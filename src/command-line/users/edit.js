"use strict";

const program = require("commander");
const child = require("child_process");
const colors = require("colors/safe");
const fs = require("fs");
const Helper = require("../../helper");
const Utils = require("../utils");

program
	.command("edit <name>")
	.description(`Edit user file located at ${colors.green(Helper.getUserConfigPath("<name>"))}.`)
	.on("--help", Utils.extraHelp)
	.action(function(name) {
		if (!fs.existsSync(Helper.getUsersPath())) {
			log.error(`${Helper.getUsersPath()} does not exist.`);
			return;
		}

		const ClientManager = require("../../clientManager");

		var users = new ClientManager().getUsers();

		if (users === undefined) { // There was an error, already logged
			return;
		}

		if (users.indexOf(name) === -1) {
			log.error(`User ${colors.bold(name)} does not exist.`);
			return;
		}
		var child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Helper.getUserConfigPath(name)],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function() {
			log.error(`Unable to open ${colors.green(Helper.getUserConfigPath(name))}. ${colors.bold("$EDITOR")} is not set, and ${colors.bold("vi")} was not found.`);
		});
	});
