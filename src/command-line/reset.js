var bcrypt = require("bcrypt");
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
		var file = Helper.resolveHomePath("users/" + name + "/user.json");
		var user = require(file);
		require("read")({
			prompt: "Password: "
		}, function(err, password) {
			console.log("");
			if (err) {
				return;
			}
			var hash = bcrypt.hashSync(password, 8);
			user.password = hash;
			fs.writeFileSync(
				file,
				JSON.stringify(user, null, "  "),
				{mode: "0777"}
			);
			console.log("Successfully reset password for '" + name + "'.");
			console.log("");
		});
	});
