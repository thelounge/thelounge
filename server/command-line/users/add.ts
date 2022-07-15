import log from "../../log";
import colors from "chalk";
import {Command} from "commander";
import fs from "fs";
import Helper from "../../helper";
import Config from "../../config";
import Utils from "../utils";

const program = new Command("add");
program
	.description("Add a new user")
	.on("--help", Utils.extraHelp)
	.option("--password [password]", "new password, will be prompted if not specified")
	.option("--save-logs", "if password is specified, this enables saving logs to disk")
	.argument("<name>", "name of the user")
	.action(function (name, cmdObj) {
		if (!fs.existsSync(Config.getUsersPath())) {
			log.error(`${Config.getUsersPath()} does not exist.`);
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const ClientManager = require("../../clientManager").default;
		const manager = new ClientManager();
		const users = manager.getUsers();

		if (users === undefined) {
			// There was an error, already logged
			return;
		}

		if (users.includes(name)) {
			log.error(`User ${colors.bold(name)} already exists.`);
			return;
		}

		if (cmdObj.password) {
			add(manager, name, cmdObj.password, !!cmdObj.saveLogs);
			return;
		}

		log.prompt(
			{
				text: "Enter password:",
				silent: true,
			},
			function (err, password) {
				if (!password) {
					log.error("Password cannot be empty.");
					return;
				}

				if (!err) {
					log.prompt(
						{
							text: "Save logs to disk?",
							default: "yes",
						},
						function (err2, enableLog) {
							if (!err2) {
								add(
									manager,
									name,
									password,
									enableLog.charAt(0).toLowerCase() === "y"
								);
							}
						}
					);
				}
			}
		);
	});

function add(manager, name, password, enableLog) {
	const hash = Helper.password.hash(password);
	manager.addUser(name, hash, enableLog);

	log.info(`User ${colors.bold(name)} created.`);
	log.info(`User file located at ${colors.green(Config.getUserConfigPath(name))}.`);
}

export default program;
