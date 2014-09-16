var ClientManager = new require("../clientManager");
var bcrypt = require("bcrypt");
var fs = require("fs");
var program = require("commander");
var mkdirp = require("mkdirp");
var Helper = require("../helper");

program
	.command("add <name> [<password>]")
	.description("Add a new user")
	.action(function(name, password) {
		var path = Helper.resolveHomePath("users");
		try {
			mkdirp.sync(path);
		} catch (e) {
			console.log("");
			console.log("Could not create " + path);
			console.log("Try running the command as sudo.");
			console.log("");
			return;
		}
		try {
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
		if (password) {
			add(manager, name, password);
		} else {
			require("read")({
				prompt: "Password: ",
				silent: true
			}, function(err, password) {
				if (!err) add(manager, name, password);
			});
		}
	});

function add(manager, name, password) {
	console.log("");
	var hash = bcrypt.hashSync(password, 8);
	manager.addUser(
		name,
		hash
	);
	console.log("User '" + name + "' created:");
	console.log(Helper.resolveHomePath("users", name, "user.json"));
	console.log("");
}
