"use strict";

var ClientManager = new require("../clientManager");
var bcrypt = require("bcrypt-nodejs");
var program = require("commander");
var Helper = require("../helper");

program
	.command("add <name>")
	.description("Add a new user")
	.action(function(name/* , password */) {
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
	log.info(Helper.getUserConfigPath(name));
}
