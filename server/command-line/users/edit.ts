import log from "../../log";
import {Command} from "commander";
import child from "child_process";
import colors from "chalk";
import fs from "fs";
import Config from "../../config";
import Utils from "../utils";

const program = new Command("edit");
program
	.description(`Edit user file located at ${colors.green(Config.getUserConfigPath("<name>"))}`)
	.argument("<name>", "name of the user")
	.on("--help", Utils.extraHelp)
	.action(function (name) {
		if (!fs.existsSync(Config.getUsersPath())) {
			log.error(`${Config.getUsersPath()} does not exist.`);
			return;
		}

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const ClientManager = require("../../clientManager").default;
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

export default program;
