var _ = require("lodash");
var fs = require("fs");
var Client = require("./client");
var mkdirp = require("mkdirp");
var Helper = require("./helper");
var moment = require("moment");

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

ClientManager.prototype.loadUsers = function() {
	var users = this.getUsers();
	for (var i in users) {
		this.loadUser(users[i]);
	}
};

ClientManager.prototype.loadUser = function(name) {
	try {
		var json = fs.readFileSync(
			Helper.resolveHomePath("users", name, "user.json"),
			"utf-8"
		);
		json = JSON.parse(json);
	} catch(e) {
		console.log(e);
		return;
	}
	if (!json) {
		return;
	}
	if (!this.findClient(name)) {
		this.clients.push(new Client(
			this.sockets,
			name,
			json
		));
		console.log(
			"User '" + name + "' loaded."
		);
	}
};

ClientManager.prototype.getUsers = function() {
	var users = [];
	var path = Helper.resolveHomePath("users");

	mkdirp.sync(path);

	try {
		users = fs.readdirSync(path);
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
		var path = Helper.resolveHomePath("users", name);
		var user = {
			user: name,
			password: password || "",
			networks: []
		};
		fs.mkdirSync(path);
		fs.writeFileSync(
			path + "/user.json",
			JSON.stringify(user, null, "  "),
			{mode: "0777"}
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
		var path = Helper.resolveHomePath("users", name);
		fs.unlinkSync(path + "/user.json");
		fs.rmdirSync(path);
	} catch(e) {
		throw e;
	}
	return true;
};

ClientManager.prototype.autoload = function(sockets) {
	var self = this;
	var loaded = ["erming"];
	setInterval(function() {
		var loaded = _.pluck(
			self.clients,
			"name"
		);

		var added = _.difference(self.getUsers(), loaded);
		_.each(added, function(name) {
			self.loadUser(name);
		});

		var removed = _.difference(loaded, self.getUsers());
		_.each(removed, function(name) {
			var client = _.find(
				self.clients, {
					name: name
				}
			);
			if (client) {
				client.quit();
				self.clients = _.without(self.clients, client);
				console.log(
					"User '" + name + "' disconnected."
				);
			}
		});
	}, 1000);
};
