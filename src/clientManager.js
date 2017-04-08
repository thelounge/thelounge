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
	self.getUsersPromise({this: self})
		.then(self.loadUsersPromise)
		.then(() => {
			fs.watch(Helper.USERS_PATH, _.debounce(() => {
				self.getUsersPromise()
					.then((data) => {
						let updatedUsers = data.users;
						const loaded = self.clients.map(c => c.name);
						// New users created since last time users were loaded
						self.loadUsersPromise({users: _.difference(updatedUsers, loaded)});

						// Existing users removed since last time users were loaded
						_.difference(loaded, updatedUsers).forEach(name => {
							const client = _.find(self.clients, {name: name});
							if (client) {
								client.quit();
								self.clients = _.without(self.clients, client);
								log.info(`User ${colors.bold(name)} disconnected and removed`);
							}
						});
					});
			}, 1000, {maxWait: 10000}));
		});
};

ClientManager.prototype.loadUserPromise = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	return new Promise((resolve, reject) => {
		self.readUserConfigPromise(data)
			.then((input) => {
				let json = input.config;
				if (!self.findClient(name)) {
					self.clients.push(new Client(
						self,
						name,
						json
					));
					resolve(data);
				}
			})
			.catch((err) => {
				log.error("Failed to read user config.", err);
				reject(err);
			});
	});
};

ClientManager.prototype.loadUsersPromise = function(data) {
	let self = data.this || this;
	let loadusers = data.users || [];
	return new Promise((resolve, reject) => {
		// let current = input.users
		// load users what are missing

		const current = self.clients.map(c => c.name);
		let loadpromises = _.difference(loadusers, current)
			.map((user) => self.loadUserPromise({name: user}));

		Promise.all(loadpromises)
			.then(() => resolve(data))
			.catch((err)=> {
				reject(err);
			});
	});
};

ClientManager.prototype.addUserPromise = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	let password = data.password || undefined;
	let enableLog = data.enableLog || undefined;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then((input) => {
				let users = input.users;
				if (users.indexOf(name) !== -1) {
					reject(false);
					throw new Error("User " + name + " already exist.");
				}
				if (require("path").basename(name) !== name) {
					reject(false);
					throw new Error(name + " is an invalid username.");
				}
				const user = {
					user: name,
					password: password || "",
					log: enableLog,
					networks: []
				};
				fs.writeFile(Helper.getUserConfigPath(name),
					JSON.stringify(user, null, "\t"),
					"utf-8",
					(err) => {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					}
				);
			})
			.catch((err) => {
				log.error(`Error adding user ${colors.bold(name)}.`, err.message);
			});
	});
};

ClientManager.prototype.updateUserPromise = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	let opts = data.opts || undefined;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then((input) => {
				let users = input.users;
				if (users.indexOf(name) === -1) {
					reject(data);
					throw new Error(name + " does not exist.");
				}
				if (typeof opts === "undefined") {
					reject(data);
					throw new Error("Options are not set");
				}
				self.readUserConfigPromise(data)
					.then((input2) => {
						let config = input2.config;
						const currentUser = JSON.stringify(config, null, "\t");
						_.assign(config, data.opts);
						const newUser = JSON.stringify(config, null, "\t");
						// Do not touch the disk if object has not changed
						if (currentUser === newUser) {
							resolve(data);
						} else {
							fs.writeFile(Helper.getUserConfigPath(name),
								newUser,
								"utf-8",
								(err) => {
									if (err) {
										reject(err);
									} else {
										resolve(data);
									}
								}
							);
						}
					});
			})
			.catch((err) => {
				log.error("Failed to Update user.", err.message);
			});
	});
};

ClientManager.prototype.removeUserPromise = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then((input) => {
				let users = input.users;
				if (users.indexOf(name) === -1) {
					throw new Error(`User ${colors.bold(name)} does not exist.`);
				} else {
					fs.unlink(Helper.getUserConfigPath(name),
					(err) => {
						if (err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				}
			})
			.catch((err) => {
				log.error("Failed to remove user.", err.message);
				return err;
			}
			);
	});
};

ClientManager.prototype.getUsersPromise = function(data) {
	return new Promise((resolve, reject) => {
		fs.readdir(Helper.USERS_PATH,
				(err, files) => {
					if (err) {
						reject(err);
					} else {
						var users = [];
						files.forEach(file => {
							if (file.indexOf(".json") !== -1) {
								users.push(file.replace(".json", ""));
							}
						});
						data = data || {};
						data.users = users;
						resolve(data);
					}
				}
			);
	}
	);
};

ClientManager.prototype.readUserConfigPromise = function(data) {
	let self = data.this || this;
	let name = data.name || undefined;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then((input) => {
				let users = input.users;
				if (users.indexOf(name) === -1) {
					reject(false);
					throw new Error("No config file with that user name: " + name);
				}
			})
			.then(() => {
				fs.readFile(Helper.getUserConfigPath(name), "utf-8",
						(err, config) => {
							if (err) {
								reject(err);
							} else {
								data.config = JSON.parse(config);
								resolve(data);
							}
						}
					);
			}
			).catch(
				(err) => {
					log.error("Failed to read user config", err);
				}
			);
	});
};
