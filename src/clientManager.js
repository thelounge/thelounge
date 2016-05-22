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
		var json = this.readUserConfig(name);
	} catch (e) {
		log.error("Failed to read user config", e);
		return;
	}
	if (!this.findClient(name)) {
		this.clients.push(new Client(
			this,
			name,
			json
		));
	}
};

ClientManager.prototype.getUsers = function() {
	var users = [];
	mkdirp.sync(Helper.USERS_PATH);
	try {
		var files = fs.readdirSync(Helper.USERS_PATH);
		files.forEach(function(file) {
			if (file.indexOf(".json") !== -1) {
				users.push(file.replace(".json", ""));
			}
		});
	} catch (e) {
		log.error("Failed to get users", e);
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
		mkdirp.sync(Helper.USERS_PATH);

		if (require("path").basename(name) !== name) {
			throw new Error(name + " is an invalid username.");
		}

		var user = {
			user: name,
			password: password || "",
			log: false,
			networks: []
		};
		fs.writeFileSync(
			Helper.getUserConfigPath(name),
			JSON.stringify(user, null, "  ")
		);
	} catch (e) {
		log.error("Failed to add user " + name, e);
		throw e;
	}
	return true;
};

ClientManager.prototype.updateUser = function(name, opts) {
	var users = this.getUsers();
	if (users.indexOf(name) === -1) {
		return false;
	}
	if (typeof opts === "undefined") {
		return false;
	}

	var user = {};
	try {
		user = this.readUserConfig(name);
		_.assign(user, opts);
		fs.writeFileSync(
			Helper.getUserConfigPath(name),
			JSON.stringify(user, null, " ")
		);
	} catch (e) {
		log.error("Failed to update user", e);
		return;
	}
	return true;
};

ClientManager.prototype.readUserConfig = function(name) {
	var users = this.getUsers();
	if (users.indexOf(name) === -1) {
		return false;
	}
	var user = {};
	var data = fs.readFileSync(Helper.getUserConfigPath(name), "utf-8");
	user = JSON.parse(data);
	return user;
};

ClientManager.prototype.removeUser = function(name) {
	var users = this.getUsers();
	if (users.indexOf(name) === -1) {
		return false;
	}
	try {
		fs.unlinkSync(Helper.getUserConfigPath(name));
	} catch (e) {
		throw e;
	}
	return true;
};

ClientManager.prototype.autoload = function(/* sockets */) {
	var self = this;
	setInterval(function() {
		var loaded = _.map(
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
				log.info("User '" + name + "' disconnected");
			}
		});
	}, 1000);
};
