var bcrypt = require("bcrypt-nodejs");
var ClientManager = new require("../clientManager");
var fs = require("fs");
var program = require("commander");
var Helper = require("../helper");

program
	.command("reset <name>")
	.description("Reset user password")
	.action(function(name) {
		var users = new ClientManager().getUsers();
		if (users.indexOf(name) === -1) {
			log.error("User '" + name + "' doesn't exist.");
			return;
		}
		var file = Helper.HOME + "/users/" + name + ".json";
		var user = require(file);
		require("read")({
			prompt: "[thelounge] New password: ",
			silent: true
		}, function(err, password) {
			if (err) {
				return;
			}
			var salt = bcrypt.genSaltSync(8);
			var hash = bcrypt.hashSync(password, salt);
			user.password = hash;
			fs.writeFileSync(
				file,
				JSON.stringify(user, null, "  ")
			);
			log.info("Successfully reset password for '" + name + "'.");
		});
	});
