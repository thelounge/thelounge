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
	.option("-H, --host <ip>", "set the IP address or hostname for the web server to listen on")
	.option("-P, --port <port>", "set the port to listen on")
	.option("-B, --bind <ip>", "set the local IP to bind to for outgoing connections")
	.option("    --public", "start in public mode")
	.option("    --private", "start in private mode")
	.description("Start the server")
	.on("--help", Utils.extraHelp)
	.action(function(options) {
		initalizeConfig();

		const server = require("../server");

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
		log.info(`Configuration file created at ${colors.green(Helper.getConfigPath({expanded: false}))}.`);
	}

	fsextra.ensureDirSync(Helper.getUsersPath());
}
