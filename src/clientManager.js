var _ = require("lodash");
var fs = require("fs");
var Client = require("./client");

module.exports = ClientManager;

function ClientManager() {
	this.clients = [];
}

ClientManager.prototype.findClient = function(name) {
	for (var i in this.clients) {
		var client = this.clients[i];
		if (client.name == name) {
			return client;
		}
	}
	return false;
};

ClientManager.prototype.loadUsers = function(sockets) {
	var users = this.getUsers();
	for (var i in users) {
		var name = users[i];
		var json = this.loadUser(name);
		if (!json) {
			continue;
		}
		if (!this.findClient(name)) {
			this.clients.push(new Client(
				sockets,
				json
			));
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
	users = _.without(
		users,
		"example"
	);
	return users;
};

ClientManager.prototype.addUser = function(name, password) {
	var users = this.getUsers();
	if (users.indexOf(name) !== -1) {
		return false;
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
	return true;
};

ClientManager.prototype.removeUser = function(name) {
	var users = this.getUsers();
	if (users.indexOf(name) === -1) {
		return false;
	}
	try {
		var path = "users/" + name;
		fs.unlinkSync(path + "/user.json");
		fs.rmdirSync(path);
	} catch(e) {
		throw e;
	}
	return true;
};
