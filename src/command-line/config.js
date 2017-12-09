"use strict";

const program = require("commander");
const child = require("child_process");
const colors = require("colors/safe");
const fs = require("fs");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("config")
	.description(`Edit configuration file located at ${colors.green(Helper.getConfigPath())}.`)
	.on("--help", Utils.extraHelp)
	.action(function() {
		if (!fs.existsSync(Helper.getConfigPath())) {
			log.error(`${Helper.getConfigPath()} does not exist.`);
			return;
		}

		var child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Helper.getConfigPath()],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function() {
			log.error(`Unable to open ${colors.green(Helper.getConfigPath())}. ${colors.bold("$EDITOR")} is not set, and ${colors.bold("vi")} was not found.`);
		});
	});
