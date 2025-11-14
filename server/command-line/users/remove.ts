import log from "../../log.js";
import colors from "chalk";
import {Command} from "commander";
import fs from "fs";
import Config from "../../config.js";
import Utils from "../utils.js";

const program = new Command("remove");
program
	.description("Remove an existing user")
	.on("--help", Utils.extraHelp)
	.argument("<name>", "name of the user")
	.action(function (name) {
		if (!fs.existsSync(Config.getUsersPath())) {
			log.error(`${Config.getUsersPath()} does not exist.`);
			return;
		}

		 
		const ClientManager = require("../../clientManager").default;
		const manager = new ClientManager();

		try {
			if (manager.removeUser(name)) {
				log.info(`User ${colors.bold(name)} removed.`);
			} else {
				log.error(`User ${colors.bold(name)} does not exist.`);
			}
		} catch {
			// There was an error, already logged
		}
	});

export default program;
