var ClientManager = new require("../clientManager");
var bcrypt = require("bcrypt-nodejs");
var fs = require("fs");
var program = require("commander");
var mkdirp = require("mkdirp");
var Helper = require("../helper");

program
	.command("add <name>")
	.description("Add a new user")
	.action(function(name/* , password */) {
		var path = Helper.HOME + "/users";
		try {
			mkdirp.sync(path);
		} catch (e) {
			log.error("Could not create", path);
			log.info("Try running the command as sudo.");
			return;
		}
		try {
			var test = path + "/.test";
			fs.mkdirSync(test);
			fs.rmdirSync(test);
		} catch (e) {
			log.error("You have no permissions to write to", path);
			log.info("Try running the command as sudo.");
			return;
		}
		var manager = new ClientManager();
		var users = manager.getUsers();
		if (users.indexOf(name) !== -1) {
			log.error("User '" + name + "' already exists.");
			return;
		}
		require("read")({
			prompt: "[thelounge] Enter password: ",
			silent: true
		}, function(err, password) {
			if (!err) {
				add(manager, name, password);
			}
		});
	});

function add(manager, name, password) {
	var salt = bcrypt.genSaltSync(8);
	var hash = bcrypt.hashSync(password, salt);
	manager.addUser(
		name,
		hash
	);
	log.info("User '" + name + "' created:");
	log.info(Helper.HOME + "/users/" + name + ".json");
}
