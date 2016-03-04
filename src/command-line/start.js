var ClientManager = new require("../clientManager");
var program = require("commander");
var server = require("../server");
var Helper = require("../helper");

program
	.option("-H, --host <ip>"   , "host")
	.option("-P, --port <port>" , "port")
	.option("-B, --bind <ip>"   , "bind")
	.option("    --public"      , "mode")
	.option("    --private"     , "mode")
	.command("start")
	.description("Start the server")
	.action(function() {
		var users = new ClientManager().getUsers();
		var config = Helper.getConfig();
		var mode = config.public;
		if (program.public) {
			mode = true;
		} else if (program.private) {
			mode = false;
		}
		if (!mode && !users.length && !config.ldap.enable) {
			console.log("");
			console.log("No users found!");
			console.log("Create a new user with 'lounge add <name>'.");
			console.log("");
		} else {
			server({
				host: program.host || process.env.IP   || config.host,
				port: program.port || process.env.PORT || config.port,
				bind: program.bind || config.bind,
				public: mode
			});
		}
	});
