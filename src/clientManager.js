var _ = require("lodash");
var fs = require("fs");

module.exports = ClientManager;

function ClientManager() {
	this.clients = [];
}

ClientManager.prototype.loadUsers = function() {
	var users = this.getUsers();
	_.each(users, function(user) {
		console.log(user);
	});
};

ClientManager.prototype.getUsers = function() {
	var users = [];
	try {
		users = fs.readdirSync("users/");
	} catch(e) {
		console.log(e);
		return;
	}
	return users;
};

ClientManager.prototype.addUser = function(name) {
	var users = this.getUsers();
	if (users.indexOf(name) !== -1) {
		console.log("User '" + name + "' already exist.");
		return;
	}

	try {
		var path = "users/" + name;
		fs.mkdirSync(path);
		fs.writeFileSync(path + "/user.json", "{}");
	} catch(e) {
		throw e;
	}

	console.log(
		"Added '" + name + "'."
	);
};

ClientManager.prototype.removeUser = function(name) {
	var users = this.getUsers();
	if (users.indexOf(name) === -1) {
		console.log("User '" + name + "' doesn't exist.");
		return;
	}

	try {
		var path = "users/" + name;
		fs.unlinkSync(path + "/user.json");
		fs.rmdirSync(path);
	} catch(e) {
		throw e;
	}

	console.log(
		"Removed '" + name + "'."
	);
};
