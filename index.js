#!/usr/bin/env node

process.chdir(__dirname);

var config = require("./config.json");
var ClientManager= new require("./src/clientManager");
var program = require("commander");
var shout = require("./src/server.js");

program
	.option("-p, --port <port>")
	.option("-P, --public");

program
	.command("start")
	.description("Start the server")
	.action(function() {
		shout(program.port, program.public);
	});

program
	.command("list-users")
	.description("List all existing users")
	.action(function() {
		var manager = new ClientManager();
		var users = manager.getUsers();
		for (var i = 0; i < users.length; i++) {
			console.log((i + 1) + " " + users[i]);
		}
	});

program
	.command("add-user <name>")
	.description("Add a new user")
	.action(function(name) {
		var manager = new ClientManager();
		require("read")({
			prompt: "Password: "
		}, function(err, password) {
			if (err) {
				console.log("");
				return;
			}
			manager.addUser(
				name,
				password
			);
		});
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
