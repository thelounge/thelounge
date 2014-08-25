var ClientManager = new require("../clientManager");
var fs = require("fs");
var program = require("commander");

program
	.command("remove <name>")
	.description("Remove an existing user")
	.action(function(name) {
		try {
			var path = process.cwd() + "/users";
			var test = path + "/.test";
			fs.mkdirSync(test);
			fs.rmdirSync(test);
		} catch (e) {
			console.log("");
			console.log("You have no permissions to delete from " + path);
			console.log("Try running the command as sudo.");
			console.log("");
			return;
		}
		var manager = new ClientManager();
		if (manager.removeUser(name)) {
			console.log("");
			console.log("Removed '" + name + "'.");
			console.log("");
		} else {
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
		}
	});
