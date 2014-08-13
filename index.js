#!/usr/bin/env node

process.chdir(__dirname);

var config = require("./config.json");
var program = require("commander");
var ClientManager = require("./src/clientManager");
var shout = require("./src/server.js");

program
	.option("-p, --port <port>");

program
	.command("start")
	.description("Start the server")
	.action(function() {
		var port = program.port || config.port;
		shout(port);
	});

program
	.command("list-users")
	.description("List all existing users")
	.action(function() {
		var manager = new ClientManager();
		var users = manager.getUsers();
		for (var u in users) {
			console.log(users[u]);
		}
	});

program
	.command("add-user <name>")
	.description("Add a new user")
	.action(function(name) {
		var manager = new ClientManager();
		manager.addUser(name);
	});

program
	.command("remove-user <name>")
	.description("Remove an existing user")
	.action(function(name) {
		var manager = new ClientManager();
		manager.removeUser(name);
	});

program.parse(process.argv)

if (!program.args.length) {
	program.help();
}
