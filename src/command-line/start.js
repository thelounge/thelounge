"use strict";

const log = require("../log");
const colors = require("chalk");
const fs = require("fs");
const path = require("path");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("start")
	.description("Start the server")
	.option("--dev", "Development mode with hot module reloading")
	.on("--help", Utils.extraHelp)
	.action(function (options) {
		initalizeConfig();

		const server = require("../server");
		server(options);
	});

function initalizeConfig() {
	if (!fs.existsSync(Helper.getConfigPath())) {
		fs.mkdirSync(Helper.getHomePath(), {recursive: true});
		fs.chmodSync(Helper.getHomePath(), "0700");
		fs.copyFileSync(
			path.resolve(path.join(__dirname, "..", "..", "defaults", "config.js")),
			Helper.getConfigPath()
		);
		log.info(`Configuration file created at ${colors.green(Helper.getConfigPath())}.`);
	}

	fs.mkdirSync(Helper.getUsersPath(), {recursive: true, mode: 0o700});
}
