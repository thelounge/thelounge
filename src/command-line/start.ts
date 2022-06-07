import log from "../log";
import colors from "chalk";
import fs from "fs";
import path from "path";
import {Command} from "commander";
import Config from "../config";
import Utils from "./utils";

const program = new Command("start");
program
	.description("Start the server")
	.option("--dev", "Development mode with hot module reloading")
	.on("--help", Utils.extraHelp)
	.action(function (options) {
		initalizeConfig();

		const newLocal = "../server";
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const server = require(newLocal);
		server.default(options);
	});

function initalizeConfig() {
	if (!fs.existsSync(Config.getConfigPath())) {
		fs.mkdirSync(Config.getHomePath(), {recursive: true});
		fs.chmodSync(Config.getHomePath(), "0700");
		fs.copyFileSync(
			path.resolve(path.join(__dirname, "..", "..", "defaults", "config.js")),
			Config.getConfigPath()
		);
		log.info(`Configuration file created at ${colors.green(Config.getConfigPath())}.`);
	}

	fs.mkdirSync(Config.getUsersPath(), {recursive: true, mode: 0o700});
}

export default program;
