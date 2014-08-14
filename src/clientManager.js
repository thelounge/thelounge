var fs = require("fs");
var Client = require("./client");

module.exports = ClientManager;

function ClientManager() {
	this.clients = {};
}

ClientManager.prototype.loadUsers = function(sockets) {
	var users = this.getUsers();
	for (var i in users) {
		if (name == "example") {
			continue;
		}
		var name = users[i];
		var json = this.loadUser(name);
		if (!json) {
			continue;
		}
		if (!this.clients[name]) {
			this.clients[name] = new Client(
				sockets,
				json
			);
		}
	}
};

ClientManager.prototype.loadUser = function(name) {
	try {
		var json = fs.readFileSync("users/" + name + "/user.json", "utf-8");
		json = JSON.parse(json);
	} catch(e) {
		console.log(e);
		return;
	}
	return json;
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

ClientManager.prototype.addUser = function(name, password) {
	var users = this.getUsers();
	if (users.indexOf(name) !== -1) {
		console.log("User '" + name + "' already exist.");
		return;
	}
	try {
		var path = "users/" + name;
		var user = {
			user: name,
			password: password || "",
			networks: []
		};
		fs.mkdirSync(path);
		fs.writeFileSync(
			path + "/user.json",
			JSON.stringify(user, null, "  ")
		);
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
