"use strict";

const colors = require("chalk");
const fs = require("fs");
const fsextra = require("fs-extra");
const path = require("path");
const program = require("commander");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("start")
	.description("Start the server")
	.on("--help", Utils.extraHelp)
	.action(function() {
		initalizeConfig();

		const server = require("../server");
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
