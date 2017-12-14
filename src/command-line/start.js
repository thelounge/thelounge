"use strict";

const colors = require("colors/safe");
const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("start")
	.option("-H, --host <ip>", `${colors.bold.red("[DEPRECATED]")} to set the IP address or hostname for the web server to listen on, use ${colors.bold("-c host=<ip>")} instead`)
	.option("-P, --port <port>", `${colors.bold.red("[DEPRECATED]")} to set the port to listen on, use ${colors.bold("-c port=<port>")} instead`)
	.option("-B, --bind <ip>", `${colors.bold.red("[DEPRECATED]")} to set the local IP to bind to for outgoing connections, use ${colors.bold("-c bind=<ip>")} instead`)
	.option("    --public", `${colors.bold.red("[DEPRECATED]")} to start in public mode, use ${colors.bold("-c public=true")} instead`)
	.option("    --private", `${colors.bold.red("[DEPRECATED]")} to start in private mode, use ${colors.bold("-c public=false")} instead`)
	.description("Start the server")
	.on("--help", Utils.extraHelp)
	.action(function(options) {
		initalizeConfig();

		const server = require("../server");

		if (options.host) {
			log.warn(`${colors.bold("-H, --host <ip>")} is ${colors.bold.red("deprecated")} and will be removed in The Lounge v3. Use ${colors.bold("-c host=<ip>")} instead.`);
		}
		if (options.port) {
			log.warn(`${colors.bold("-P, --port <port>")} is ${colors.bold.red("deprecated")} and will be removed in The Lounge v3. Use ${colors.bold("-c port=<port>")} instead.`);
		}
		if (options.bind) {
			log.warn(`${colors.bold("-B, --bind <ip>")} is ${colors.bold.red("deprecated")} and will be removed in The Lounge v3. Use ${colors.bold("-c bind=<ip>")} instead.`);
		}
		if (options.public) {
			log.warn(`${colors.bold("--public")} is ${colors.bold.red("deprecated")} and will be removed in The Lounge v3. Use ${colors.bold("-c public=true")} instead.`);
		}
		if (options.private) {
			log.warn(`${colors.bold("--private")} is ${colors.bold.red("deprecated")} and will be removed in The Lounge v3. Use ${colors.bold("-c public=false")} instead.`);
		}

		var mode = Helper.config.public;
		if (options.public) {
			mode = true;
		} else if (options.private) {
			mode = false;
		}

		Helper.config.host = options.host || Helper.config.host;
		Helper.config.port = options.port || Helper.config.port;
		Helper.config.bind = options.bind || Helper.config.bind;
		Helper.config.public = mode;

		server();
	});

function initalizeConfig() {
	if (!fs.existsSync(Helper.getConfigPath())) {
		fsextra.ensureDirSync(Helper.getHomePath());
		fs.chmodSync(Helper.getHomePath(), "0700");
		fsextra.copySync(path.resolve(path.join(
			__dirname,
			"..",
			"..",
			"defaults",
			"config.js"
		)), Helper.getConfigPath());
		log.info(`Configuration file created at ${colors.green(Helper.getConfigPath())}.`);
	}

	fsextra.ensureDirSync(Helper.getUsersPath());
}
