var program = require("commander");
var child = require("child_process");

var CONFIG_PATH = process.cwd() + "/config.js";

program
	.command("config")
	.description("Edit config: '" + CONFIG_PATH + "'")
	.action(function() {
		child.spawn(
			"sudo",
			["vi", CONFIG_PATH],
			{stdio: "inherit"}
		);
	});
