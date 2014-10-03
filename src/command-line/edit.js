var ClientManager = new require("../clientManager");
var program = require("commander");
var child = require("child_process");
var Helper = require("../helper");

program
	.command("edit <name>")
	.description("Edit user: '" + Helper.HOME + "/users/<name>/user.json'")
	.action(function(name) {
		var users = new ClientManager().getUsers();
		if (users.indexOf(name) === -1) {
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
			return;
		}
		child.spawn(
			"vi",
			[Helper.resolveHomePath("users", name, "user.json")],
			{stdio: "inherit"}
		);
	});
