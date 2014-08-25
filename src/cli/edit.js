var ClientManager = new require("../clientManager");
var program = require("commander");
var child = require("child_process");

program
	.command("edit <name>")
	.description("Edit existing user")
	.action(function(name) {
		var users = new ClientManager().getUsers();
		if (users.indexOf(name) === -1) {
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
			return;
		}
		child.spawn(
			"sudo",
			["vi", process.cwd() + "/users/" + name + "/user.json"],
			{stdio: "inherit"}
		);
	});
