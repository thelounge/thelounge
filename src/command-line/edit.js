var ClientManager = new require("../clientManager");
var program = require("commander");
var child = require("child_process");

const HOME = process.env.HOME + "/.shout";

program
	.command("edit <name>")
	.description("Edit user: '" + HOME + "/users/<name>/user.json'")
	.action(function(name) {
		var users = new ClientManager().getUsers();
		if (users.indexOf(name) === -1) {
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
			return;
		}
		var path = HOME + "/users/";
		child.spawn(
			"vi",
			[path + name + "/user.json"],
			{stdio: "inherit"}
		);
	});
