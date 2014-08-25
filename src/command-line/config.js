var program = require("commander");
var child = require("child_process");

program
	.command("config")
	.description("Open the config")
	.action(function() {
		child.spawn(
			"sudo",
			["vi", process.cwd() + "/config.json"],
			{stdio: "inherit"}
		);
	});
