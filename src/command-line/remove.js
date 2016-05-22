var ClientManager = new require("../clientManager");
var program = require("commander");

program
	.command("remove <name>")
	.description("Remove an existing user")
	.action(function(name) {
		var manager = new ClientManager();
		if (manager.removeUser(name)) {
			log.info("Removed user '" + name + "'.");
		} else {
			log.error("User '" + name + "' doesn't exist.");
		}
	});
