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
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
			return;
		}
		var file = Helper.HOME + "/users/" + name + ".json";
		var user = require(file);
		require("read")({
			prompt: "[thelounge] New password: ",
			silent: true
		}, function(err, password) {
			console.log("");
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
			console.log("Successfully reset password for '" + name + "'.");
			console.log("");
		});
	});
