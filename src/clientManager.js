var _ = require("lodash");
var fs = require("fs");
var Client = require("./client");
var mkdirp = require("mkdirp");
var Helper = require("./helper");
var moment = require("moment");

module.exports = ClientManager;

function ClientManager() {
	var self = this;
	this.clients = [];
	if(!/^win/.test(process.platform)) {
		process.on('SIGHUP', function() {
			console.log("Received 'SIGHUP'. Reloading Users.");
			self.reloadUsers();
		});
	}
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
			Helper.HOME + "/users/" + name + "/user.json",
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
		console.log("User '%s' loaded.", name);
	}
};

ClientManager.prototype.reloadUsers = function() {
	var users = this.getUsers();
	for (var i in users) {
		this.reloadUser(users[i]);
	}
};

ClientManager.prototype.reloadUser = function(name) {
	var client = this.findClient(name);
	if (client) {
		try {
			var json = fs.readFileSync(
				Helper.HOME + "/users/" + name + "/user.json",
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
		client.config = json;
		console.log("User '%s' reloaded.", name);
	}
};

ClientManager.prototype.getUsers = function() {
	var users = [];
	var path = Helper.HOME + "/users";
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
		var path = Helper.HOME + "/users/" + name;
		var user = {
			user: name,
			password: password || "",
			logs: false,
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
		var path = Helper.HOME + "/users/" + name;
		fs.unlinkSync(path + "/user.json");
		fs.rmdirSync(path);
	} catch(e) {
		throw e;
	}
	return true;
};

ClientManager.prototype.watchUser = function(name) {
	var self = this;
	var client = this.findClient(name);
	if(!client || client.watcher) {
		return;
	}
	var path = Helper.HOME + "/users/" + client.name + "/user.json";
	var lastReload = Date.now();
	client.watcher = fs.watch(path, {persistent: false}, function(event, filename) {
		switch (event) {
		case "change":
			// user.json modified
			if(Date.now() - lastReload > 50) {
				self.reloadUser(client.name);
				lastReload = Date.now();
			}
			break;
		default:
			break;
		}
	});
};

ClientManager.prototype.autoload = function(sockets) {
	var self = this;

	// Listen to new users being added/removed
	fs.watch(Helper.HOME + "/users/", { persistent: false }, function(event, filename) {
		switch (event) {
		case "rename":
			if(filename === null) {
				// User removed.
				var removed = _(self.clients)
							.pluck('name')
							.difference(self.getUsers())
							.value();
				_.each(removed, function(name) {
					var client = self.findClient(name);
					if (client) {
						client.quit();
						if(client.watcher) {
							client.watcher.close();
						}
						self.clients = _.without(self.clients, client);
						console.log("User '%s' disconnected.", name);
					}
				});
			} else {
				// User created.
				self.loadUser(filename);
				self.watchUser(filename);
			}
			break;
		default:
			break;
		}
	});

	// Listen to user modification
	_.each(this.clients, function(client) {
		self.watchUser(client.name);
	});
};
