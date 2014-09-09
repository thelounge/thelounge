var config = require("../../config.json");
var ClientManager = new require("../clientManager");
var program = require("commander");
var shout = require("../server");

program
	.option("-h, --host <ip>", "host")
	.option("-p, --port <port>", "port")
	.command("start")
	.description("Start the server")
	.action(function() {
		var users = new ClientManager().getUsers();
		if (!config.public && !users.length) {
			console.log("");
			console.log("No users found!");
			console.log("Create a new user with 'shout add <name>'.")
			console.log("");
		} else {
			var host = program.host || process.env.IP || config.host;
			var port = program.port || process.env.PORT || config.port;
			shout(port, host, config.public);
		}
	});
