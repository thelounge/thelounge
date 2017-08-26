"use strict";

const program = require("commander");
const child = require("child_process");
const colors = require("colors/safe");
const fs = require("fs");
const Helper = require("../helper");
const Utils = require("./utils");

program
	.command("config")
	.description(`Edit configuration file located at ${colors.green(Helper.CONFIG_PATH)}.`)
	.on("--help", Utils.extraHelp)
	.action(function() {
		if (!fs.existsSync(Helper.CONFIG_PATH)) {
			log.error(`${Helper.CONFIG_PATH} does not exist.`);
			return;
		}

		var child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Helper.CONFIG_PATH],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function() {
			log.error(`Unable to open ${colors.green(Helper.CONFIG_PATH)}. ${colors.bold("$EDITOR")} is not set, and ${colors.bold("vi")} was not found.`);
		});
	});
