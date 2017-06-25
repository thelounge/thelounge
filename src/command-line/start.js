"use strict";

var ClientManager = new require("../clientManager");
var program = require("commander");
var colors = require("colors/safe");
var server = require("../server");
var Helper = require("../helper");

program
	.command("start")
	.option("-H, --host <ip>", "set the IP address or hostname for the web server to listen on")
	.option("-P, --port <port>", "set the port to listen on")
	.option("-B, --bind <ip>", "set the local IP to bind to for outgoing connections")
	.option("    --public", "start in public mode")
	.option("    --private", "start in private mode")
	.description("Start the server")
	.action(function(options) {
		var users = new ClientManager().getUsers();

		var mode = Helper.config.public;
		if (options.public) {
			mode = true;
		} else if (options.private) {
			mode = false;
		}

		if (!mode && !users.length && !Helper.config.ldap.enable) {
			log.warn("No users found.");
			log.info(`Create a new user with ${colors.bold("lounge add <name>")}.`);

			return;
		}

		Helper.config.host = options.host || Helper.config.host;
		Helper.config.port = options.port || Helper.config.port;
		Helper.config.bind = options.bind || Helper.config.bind;
		Helper.config.public = mode;

		var packages = require("../packages");
		packages.emit("cmd:start");

		server();
	});
