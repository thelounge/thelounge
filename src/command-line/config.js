"use strict";

var program = require("commander");
var child = require("child_process");
var Helper = require("../helper");

program
	.command("config")
	.description("Edit config: " + Helper.CONFIG_PATH)
	.action(function() {
		var child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Helper.CONFIG_PATH],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function() {
			log.error("Unable to open " + Helper.CONFIG_PATH + ". $EDITOR is not set, and vi was not found.");
		});
	});
