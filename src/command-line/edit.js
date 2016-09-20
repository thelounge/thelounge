var ClientManager = new require("../clientManager");
var program = require("commander");
var child = require("child_process");
var Helper = require("../helper");

program
	.command("edit <name>")
	.description("Edit user: " + Helper.getUserConfigPath("<name>"))
	.action(function(name) {
		var users = new ClientManager().getUsers();
		if (users.indexOf(name) === -1) {
			log.error("User '" + name + "' doesn't exist.");
			return;
		}
		var child_spawn = child.spawn(
			process.env.EDITOR || "vi",
			[Helper.getUserConfigPath(name)],
			{stdio: "inherit"}
		);
		child_spawn.on("error", function() {
			log.error("Unable to open " + Helper.getUserConfigPath(name) + ". $EDITOR is not set, and vi was not found.");
		});
	});
