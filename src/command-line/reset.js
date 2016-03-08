var bcrypt = require("bcrypt-nodejs");
var ClientManager = new require("../clientManager");
var program = require("commander");
var Helper = require("../helper");

program
	.command("reset <name>")
	.description("Reset user password")
	.action(function(name) {
		var clientManager = new ClientManager();
		var users = clientManager.getUsers();
		if (users.indexOf(name) === -1) {
			console.log("");
			console.log("User '" + name + "' doesn't exist.");
			console.log("");
			return;
		}
		var file = Helper.HOME + "/users/" + name + ".json";
		var user = require(file);
		require("read")({
			prompt: "Password: ",
			silent: true
		}, function(err, password) {
			console.log("");
			if (err) {
				return;
			}
			var salt = bcrypt.genSaltSync(8);
			var hash = bcrypt.hashSync(password, salt);
			user.password = hash;
			clientManager.writeUser(user);
			console.log("Successfully reset password for '" + name + "'.");
			console.log("");
		});
	});
