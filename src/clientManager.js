"use strict";

var _ = require("lodash");
var colors = require("colors/safe");
var fs = require("fs");
var Client = require("./client");
var Helper = require("./helper");

module.exports = ClientManager;

function ClientManager() {
	this.clients = [];
}

ClientManager.prototype.init = function(identHandler, sockets) {
	this.sockets = sockets;
	this.identHandler = identHandler;

	if (!Helper.config.public) {
		if ("autoload" in Helper.config) {
			log.warn(`Autoloading users is now always enabled. Please remove the ${colors.yellow("autoload")} option from your configuration file.`);
		}

		this.autoloadUsers();
	}
};

ClientManager.prototype.findClient = function(name, token) {
	for (var i in this.clients) {
		var client = this.clients[i];
		if (client.name === name || (token && token === client.config.token)) {
			return client;
		}
	}
	return false;
};

ClientManager.prototype.autoloadUsers = function() {
	let self = this;
	self.getUsers({this: self, force: true})// load usernames
		.then((users) => {
			// loads all users
			return Promise.all(Object.keys(users).map(name => self.loadUser({name: name, force: true})));
		})
		.then(() => {
			fs.watch(Helper.USERS_PATH, _.debounce(() => {
				self.getUsers({force: true})
					.then((users) => {
						let updatedUsers = Object.keys(users);
						const loaded = self.clients.map(c => c.name);
						// load new users created since last time users were checked on watch
						_.difference(updatedUsers, loaded).map(name => self.loadUser({name: name, force: true}));

						// Existing users removed since last time users were checked on watch
						_.difference(loaded, updatedUsers).forEach(name => {
							const client = _.find(self.clients, {name: name});
							if (client) {
								client.quit();
								self.clients = _.without(self.clients, client);
								delete self.users[name];
								log.info(`User ${colors.bold(name)} disconnected and removed`);
							}
						});
					});
			}, 1000, {maxWait: 10000}));
		});
};

// creates user config file, when server is running, autoload will load the user
ClientManager.prototype.addUser = function(data) {
	let self = data.self || this;
	let name = data.name || undefined;
	let password = data.password || undefined;
	let enableLog = data.enableLog || undefined;
	return new Promise((resolve, reject) => {
		self.getUsers(data)
			.then((users) => {
				if (name in users) {
					return Promise.reject(new Error(`Error creating user, user ${colors.bold(name)} already exist.`));
				}
				if (require("path").basename(name) !== name) {
					return Promise.reject(new Error(`Error creating user, user ${colors.bold(name)} is an invalid username.`));
				}
				const config = {
					user: name,
					password: password || "",
					log: enableLog,
					networks: []
				};
				fs.writeFile(Helper.getUserConfigPath(name),
					JSON.stringify(config, null, "\t"),
					"utf-8",
					(err) => {
						if (err) {
							reject(err);
						} else {
							self.users[name] = {};
							resolve(config);
						}
					});
			})
			.catch((err) => {
				if (err) {
					reject(err);
				}
			});
	});
};

ClientManager.prototype.updateUser = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	let opts = data.opts || undefined;
	return new Promise((resolve, reject) => {
		self.getUsers(data)
			.then((users) => {
				if (!(name in users)) {
					return Promise.reject(new Error(`Error updating user, user ${colors.bold(name)} does not exist.`));
				}
				if (typeof opts === "undefined") {
					return Promise.reject(new Error(`Error updating user, options for user ${colors.bold(name)} are not set.`));
				}
				self.readUserConfig(data)
					.then((config) => {
						const currentUser = JSON.stringify(config, null, "\t");
						_.assign(config, data.opts);
						const newUser = JSON.stringify(config, null, "\t");
						// Do not touch the disk if object has not changed
						if (currentUser === newUser) {
							resolve(true);
						} else {
							fs.writeFile(Helper.getUserConfigPath(name),
								newUser,
								"utf-8",
								(err) => {
									if (err) {
										reject(err);
									} else {
										resolve(true);
									}
								});
						}
					});
			})
			.catch((err) => {
				if (err) {
					reject(err);
				}
			});
	});
};

// removes user config file, if server is running, autoload will remove user
ClientManager.prototype.removeUser = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	return new Promise((resolve, reject) => {
		self.getUsers(data)
			.then((users) => {
				if (!(name in users)) {
					return Promise.reject(new Error(`Error removing user, user ${colors.bold(name)} does not exist.`));
				}
				fs.unlink(Helper.getUserConfigPath(name),
					(err) => {
						if (err) {
							reject(err);
						} else {
							delete self.users[name];
							resolve(data);
						}
					});
			})
			.catch((err) => {
				if (err) {
					reject(err);
				}
			});
	});
};

// gets users names, but it wont load anything and wont connect them to irc
ClientManager.prototype.getUsers = function(input) {
	let self = input.self || this;
	return new Promise((resolve, reject) => {
		if (!("force" in input) && ("users" in self)) {
			resolve(self.users);
		}		else {
			fs.readdir(Helper.USERS_PATH, (err, files) => {
				if (err) {
					reject(err);
				} else {
					self.users = self.users || {};
					files.forEach(file => {
						if (file.indexOf(".json") !== -1) {
							self.users[file.replace(".json", "")] = {};
						}
					});
					resolve(self.users);
				}
			});
		}
	});
};

// load and caches user config files

ClientManager.prototype.readUserConfig = function(input) {
	let self = input.self || this;
	let name = input.name || undefined;
	return new Promise((resolve, reject) => {
		Promise.resolve()
			.then(() => {
				// force reloading users
				if ("force" in input) {
					return self.getUsers({force: true});
				}
				return Promise.resolve(self.users);
			})
			.then((users) => {
				if (!(name in users)) {
					return Promise.reject(new Error(`User ${colors.bold(name)} config file does not exist.`));
				}
				// resolve from cache, if not forced and config is loaded
				if (!("force" in input) && ("config" in users[name])) {
					resolve(users[name].config);
					// stop reloading config from fs
					return Promise.reject(0);
				}
				return Promise.resolve(true);
			})
			.then(() => {
				fs.readFile(Helper.getUserConfigPath(name), "utf-8",
					(err, config) => {
						if (err) {
							return Promise.reject(err);
						}
						self.users[name].config = JSON.parse(config);
						resolve(self.users[name].config);
					});
			})
			.catch((err) => {
				if (err) {
					log.error(`Failed to read user ${colors.bold(name)} config.`, err);
					reject(false);
				}
			});
	});
};

// load user as a client
ClientManager.prototype.loadUser = function(input) {
	let self = input.this || this;
	let name = input.name || undefined;
	return new Promise((resolve, reject) => {
		self.readUserConfig(input)
			.then((config) => {
				if (!self.findClient(name)) {
					self.clients.push(new Client(
						self,
						name,
						config
					));
					resolve(true);
				}
			})
			.catch((err) => {
				log.error(`Failed to load user ${colors.bold(name)}.`, err);
				reject(err);
			});
	});
};
