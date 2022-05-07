import log from "../../log";
import colors from "chalk";
import {Command} from "commander";
import fs from "fs";
import Config from "../../config";
import Utils from "../utils";

const program = new Command("remove");
program
	.usage("remove <name>")
	.description("Remove an existing user")
	.on("--help", Utils.extraHelp)
	.action(function (name) {
		if (!fs.existsSync(Config.getUsersPath())) {
			log.error(`${Config.getUsersPath()} does not exist.`);
			return;
		}

		const ClientManager = require("../../clientManager");
		const manager = new ClientManager();

		try {
			if (manager.removeUser(name)) {
				log.info(`User ${colors.bold(name)} removed.`);
			} else {
				log.error(`User ${colors.bold(name)} does not exist.`);
			}
		} catch (e: any) {
			// There was an error, already logged
		}
	});

export default program;
