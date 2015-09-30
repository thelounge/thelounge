var _ = require("lodash");
var fs = require("fs");
var Client = require("./client");
var mkdirp = require("mkdirp");
var Helper = require("./helper");

module.exports = ClientManager;

function ClientManager() {
	this.clients = [];
}

ClientManager.prototype.findClient = function(name) {
	for (var i in this.clients) {
		var client = this.clients[i];
		if (client.name === name) {
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
			Helper.HOME + "/users/" + name + ".json",
			"utf-8"
		);
		json = JSON.parse(json);
	} catch (e) {
		console.log(e);
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
	var path = Helper.HOME + "/users";
	mkdirp.sync(path);
	try {
		var files = fs.readdirSync(path);
		files.forEach(function(file) {
			if (file.indexOf(".json") !== -1) {
				users.push(file.replace(".json", ""));
			}
		});
	} catch (e) {
		console.log(e);
		return;
	}
	return users;
};

ClientManager.prototype.addUser = function(name, password) {
	var users = this.getUsers();
	if (users.indexOf(name) !== -1) {
		return false;
	}
	try {
		var path = Helper.HOME + "/users";
		var user = {
			user: name,
			password: password || "",
			log: false,
			networks: []
		};
		mkdirp.sync(path);
		fs.writeFileSync(
			path + "/" + name + ".json",
			JSON.stringify(user, null, "  "),
			{mode: "0777"}
		);
	} catch (e) {
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
		var path = Helper.HOME + "/users/" + name + ".json";
		fs.unlinkSync(path);
	} catch (e) {
		throw e;
	}
	return true;
};

ClientManager.prototype.autoload = function(/* sockets */) {
	var self = this;
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

