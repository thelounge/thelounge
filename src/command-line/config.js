var program = require("commander");
var child = require("child_process");
var Helper = require("../helper");

program
	.command("config")
	.description("Edit config: " + Helper.CONFIG_PATH)
	.action(function() {
		child.spawn(
			process.env.EDITOR || "vi",
			[Helper.CONFIG_PATH],
			{stdio: "inherit"}
		);
	});
