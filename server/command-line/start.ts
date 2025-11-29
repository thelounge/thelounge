import log from "../log.js";
import colors from "chalk";
import fs from "node:fs";
import path from "node:path";
import {Command} from "commander";
import Config from "../config.js";
import Utils from "./utils.js";
import {getDirname} from "../path-helper.js";

const program = new Command("start");
program
	.description("Start the server")
	.option("--dev", "Development mode with hot module reloading")
	.on("--help", Utils.extraHelp)
	.action(async function (options) {
		initalizeConfig();
		const serverModule = await import("../server.js");

		serverModule.default(options).catch((err) => {
			log.error("Server startup failed:", err);
			process.exit(1);
		});
	});

function initalizeConfig() {
	if (!fs.existsSync(Config.getConfigPath())) {
		fs.mkdirSync(Config.getHomePath(), {recursive: true});
		fs.chmodSync(Config.getHomePath(), "0700");
		const __dirname = getDirname(import.meta.url);
		const defaultConfigPath = path.resolve(
			path.join(__dirname, "..", "..", "defaults", "config.js")
		);
		fs.copyFileSync(defaultConfigPath, Config.getConfigPath());
		log.info(`Configuration file created at ${colors.green(Config.getConfigPath())}.`);
	}

	fs.mkdirSync(Config.getUsersPath(), {recursive: true, mode: 0o700});
}

export default program;
