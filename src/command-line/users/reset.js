"use strict";

const log = require("../../log");
const colors = require("chalk");
const program = require("commander");
const fs = require("fs");
const Helper = require("../../helper");
const Utils = require("../utils");

program
	.command("reset <name>")
	.description("Reset user password")
	.on("--help", Utils.extraHelp)
	.option("--password [password]", "new password, will be prompted if not specified")
	.action(function (name, cmdObj) {
		if (!fs.existsSync(Helper.getUsersPath())) {
			log.error(`${Helper.getUsersPath()} does not exist.`);
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

		if (cmdObj.password) {
			change(name, cmdObj.password);
			return;
		}

		log.prompt(
			{
				text: "Enter new password:",
				silent: true,
			},
			function (err, password) {
				if (err) {
					return;
				}

				change(name, password);
			}
		);
	});

function change(name, password) {
	const pathReal = Helper.getUserConfigPath(name);
	const pathTemp = pathReal + ".tmp";
	const user = JSON.parse(fs.readFileSync(pathReal, "utf-8"));

	user.password = Helper.password.hash(password);
	user.sessions = {};

	const newUser = JSON.stringify(user, null, "\t");

	// Write to a temp file first, in case the write fails
	// we do not lose the original file (for example when disk is full)
	fs.writeFileSync(pathTemp, newUser, {
		mode: 0o600,
	});
	fs.renameSync(pathTemp, pathReal);

	log.info(`Successfully reset password for ${colors.bold(name)}.`);
}
