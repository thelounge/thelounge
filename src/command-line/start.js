var ClientManager = new require("../clientManager");
var program = require("commander");
var shout = require("../server");
var Helper = require("../helper");
var config = Helper.getConfig();

program
	.option("-H, --host <ip>", "host")
	.option("-p, --port <port>", "port")
	.option("    --public", "mode")
	.option("    --private", "mode")
	.command("start")
	.description("Start the server")
	.action(function() {
		var users = new ClientManager().getUsers();
		var mode = config.public;
		if (program.public) {
			mode = true;
		} else if (program.private) {
			mode = false;
		}
		if (!mode && !users.length) {
			console.log("");
			console.log("No users found!");
			console.log("Create a new user with 'shout add <name>'.");
			console.log("");
		} else {
			var host = program.host || process.env.IP || config.host;
			var port = program.port || process.env.PORT || config.port;
			shout(port, host, mode);
		}
	});
