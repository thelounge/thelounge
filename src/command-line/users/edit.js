"use strict";

const log = require("../../log");
const program = require("commander");
const child = require("child_process");
const colors = require("chalk");
const fs = require("fs");
const Config = require("../../config");
const Utils = require("../utils");

program
	.command("edit <name>")
	.description(`Edit user file located at ${colors.green(Config.getUserConfigPath("<name>"))}`)
	.on("--help", Utils.extraHelp)
	.action(function (name) {
		if (!fs.existsSync(Config.getUsersPath())) {
			log.error(`${Config.getUsersPath()} does not exist.`);
			return;
		}

		const ClientManager = require("../../clientManager");
		const users = new ClientManager().getUsers();

		if (users === undefined) {
			// There was an error, already logged
			return;
		}

		if (!users.includes(name)) {
			log.error(`User ${colors.bold(name)} does not exist.`);
			return;
		}

		const child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Config.getUserConfigPath(name)],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function () {
			log.error(
				`Unable to open ${colors.green(Config.getUserConfigPath(name))}. ${colors.bold(
					"$EDITOR"
				)} is not set, and ${colors.bold("vi")} was not found.`
			);
		});
	});
