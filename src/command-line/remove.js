var ClientManager = new require("../clientManager");
var fs = require("fs");
var program = require("commander");
var Helper = require("../helper");

program
	.command("remove <name>")
	.description("Remove an existing user")
	.action(function(name) {
		try {
			var path = Helper.HOME + "/users";
			var test = path + "/.test";
			fs.mkdirSync(test);
			fs.rmdirSync(test);
		} catch (e) {
			log.warn("You have no permissions to delete from " + path);
			log.info("Try running the command as sudo.");
			return;
		}
		var manager = new ClientManager();
		if (manager.removeUser(name)) {
			log.info("Removed user '" + name + "'.");
		} else {
			log.error("User '" + name + "' doesn't exist.");
		}
	});
