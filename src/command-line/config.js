var program = require("commander");
var child = require("child_process");
var Helper = require("../helper");

program
	.command("config")
	.description("Edit config: '" + Helper.HOME + "/config.js'")
	.action(function() {
		child.spawn(
			process.env.EDITOR || "vi",
			[Helper.HOME + "/config.js"],
			{stdio: "inherit"}
		);
	});
