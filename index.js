#!/usr/bin/env node

process.chdir(__dirname);

var config = require("./config.json");
var ClientManager= new require("./src/clientManager");
var program = require("commander");
var shout = require("./src/server.js");
var fs = require("fs");

program
	.option("-p, --port <port>")
	.option("-P, --public");

program
	.command("start")
	.description("Start the server")
	.action(function() {
		var users = new ClientManager().getUsers();
		if (!program.public && !users.length) {
			console.log("");
			console.log("No users found!");
			console.log("Create a new user with 'shout add-user <name>'.")
			console.log("");
		} else {
			shout(program.port, program.public);
		}
	});

program
	.command("list-users")
	.description("List all existing users")
	.action(function() {
		var users = new ClientManager().getUsers();
		if (!users.length) {
			console.log("");
			console.log("No users found!");
			console.log("");
		} else {
			console.log("");
			console.log("Users:");
			for (var i = 0; i < users.length; i++) {
				console.log((i + 1) + ": " + users[i]);
			}
			console.log("");
		}
	});

program
	.command("add-user <name>")
	.description("Add a new user")
	.action(function(name) {
		try {
			var path = __dirname + "/users";
			var test = path + "/.test";
			fs.mkdirSync(test);
			fs.rmdirSync(test);
		} catch (e) {
			console.log("");
			console.log("You have no permissions to write to " + path);
			console.log("Try running the command as sudo.");
			console.log("");
			return;
		}
		var manager = new ClientManager();
		var users = manager.getUsers();
		if (users.indexOf(name) !== -1) {
			console.log("");
			console.log("User '" + name + "' already exists.");
			console.log("");
			return;
		}
		require("read")({
			prompt: "Password: "
		}, function(err, password) {
			console.log("");
			if (err) {
				return;
			}
			var success = manager.addUser(
				name,
				password
			);
			console.log("Added '" + name + "'.");
			console.log("");
		});
	});

program
	.command("remove-user <name>")
	.description("Remove an existing user")
	.action(function(name) {
		try {
			var path = __dirname + "/users";
			var test = path + "/.test";
			fs.mkdirSync(test);
			fs.rmdirSync(test);
		} catch (e) {
			console.log("");
			console.log("You have no permissions to delete from " + path);
			console.log("Try running the command as sudo.");
			console.log("");
			return;
		}
		var manager = new ClientManager();
		var success = manager.removeUser(name);
		if (success) {
			console.log("");
			console.log("Removed '" + name + "'.");
			console.log("");
		} else {
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
		}
	});

program.parse(process.argv)

if (!program.args.length) {
	program.help();
}
