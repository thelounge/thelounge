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

		var mode = Helper.config.public;
		if (program.public) {
			mode = true;
		} else if (program.private) {
			mode = false;
		}

		if (!mode && !users.length && !Helper.config.ldap.enable) {
			log.warn("No users found!");
			log.info("Create a new user with 'lounge add <name>'.");

			return;
		}

		Helper.config.host = program.host || Helper.config.host;
		Helper.config.port = program.port || Helper.config.port;
		Helper.config.bind = program.bind || Helper.config.bind;
		Helper.config.public = mode;

		server();
	});
