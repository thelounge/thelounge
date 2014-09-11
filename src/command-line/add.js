var ClientManager = new require("../clientManager");
var bcrypt = require("bcrypt");
var fs = require("fs");
var program = require("commander");
var mkdirp = require("mkdirp");

const HOME = process.env.HOME + "/.shout";

program
	.command("add <name>")
	.description("Add a new user")
	.action(function(name) {
		try {
			var path = HOME + "/users";
			mkdirp.sync(path);
		} catch (e) {
			console.log("");
			console.log("Could not create " + path);
			console.log("Try running the command as sudo.");
			console.log("");
			return;
		}
		try {
			var path = HOME + "/users";
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
			var hash = bcrypt.hashSync(password, 8);
			manager.addUser(
				name,
				hash
			);
			console.log("Added '" + name + "'.");
			console.log("");
		});
	});
