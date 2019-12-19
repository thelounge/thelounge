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
	.action(function(name) {
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

		const pathReal = Helper.getUserConfigPath(name);
		const pathTemp = pathReal + ".tmp";
		const user = JSON.parse(fs.readFileSync(pathReal, "utf-8"));

		log.prompt(
			{
				text: "Enter new password:",
				silent: true,
			},
			function(err, password) {
				if (err) {
					return;
				}

				user.password = Helper.password.hash(password);
				user.sessions = {};

				const newUser = JSON.stringify(user, null, "\t");

				// Write to a temp file first, in case the write fails
				// we do not lose the original file (for example when disk is full)
				fs.writeFileSync(pathTemp, newUser);
				fs.renameSync(pathTemp, pathReal);

				log.info(`Successfully reset password for ${colors.bold(name)}.`);
			}
		);
	});
