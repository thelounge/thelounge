"use strict";

var program = require("commander");
var child = require("child_process");
var colors = require("colors/safe");
var Helper = require("../helper");

program
	.command("config")
	.description(`Edit configuration file located at ${colors.green(Helper.CONFIG_PATH)}. Set the ${colors.green("LOUNGE_HOME")} environment variable to change.`)
	.action(function() {
		var child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Helper.CONFIG_PATH],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function() {
			log.error(`Unable to open ${colors.green(Helper.CONFIG_PATH)}. ${colors.bold("$EDITOR")} is not set, and ${colors.bold("vi")} was not found.`);
		});
	});
