var config = require("../../config");
var ClientManager = new require("../clientManager");
var program = require("commander");
var shout = require("../server");

program
	.option("-h, --host <ip>", "host")
	.option("-p, --port <port>", "port")
	.option("    --public")
	.option("    --private")
	.command("start")
	.description("Start the server")
	.action(function() {
		var users = new ClientManager().getUsers();
		if (!config.public && !users.length) {
			console.log("");
			console.log("No users found!");
			console.log("Create a new user with 'shout add <name>'.");
			console.log("");
		} else {
			var host = program.host || process.env.IP || config.host;
			var port = program.port || process.env.PORT || config.port;
			var mode = config.public;
			if (program.public) {
				mode = true;
			} else if (program.private) {
				mode = false;
			}
			shout(port, host, mode);
		}
	});
