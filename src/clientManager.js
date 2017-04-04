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
	this.getUsers().forEach(name => this.loadUser(name));

	fs.watch(Helper.USERS_PATH, _.debounce(() => {
		const loaded = this.clients.map(c => c.name);
		const updatedUsers = this.getUsers();

		// New users created since last time users were loaded
		_.difference(updatedUsers, loaded).forEach(name => this.loadUser(name));

		// Existing users removed since last time users were loaded
		_.difference(loaded, updatedUsers).forEach(name => {
			const client = _.find(this.clients, {name: name});
			if (client) {
				client.quit();
				this.clients = _.without(this.clients, client);
				log.info(`User ${colors.bold(name)} disconnected and removed`);
			}
		});
	}, 1000, {maxWait: 10000}));
};

ClientManager.prototype.loadUser = function(name) {
	let self = this;
	self.readUserConfigPromise(name)
		.then(
			(json) => {
				if (!self.findClient(name)) {
					self.clients.push(new Client(
						self,
						name,
						json
					));
				}
			}
		).catch(
			(err) => {
				log.error("Failed to read user config", err);
			}
		);
};

ClientManager.prototype.getUsers = function() {
	var users = [];
	try {
		var files = fs.readdirSync(Helper.USERS_PATH);
		files.forEach(file => {
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

ClientManager.prototype.addUser = function(name, password, enableLog) {
	var users = this.getUsers();
	if (users.indexOf(name) !== -1) {
		return false;
	}
	try {
		if (require("path").basename(name) !== name) {
			throw new Error(name + " is an invalid username.");
		}

		var user = {
			user: name,
			password: password || "",
			log: enableLog,
			networks: []
		};
		fs.writeFileSync(
			Helper.getUserConfigPath(name),
			JSON.stringify(user, null, "\t")
		);
	} catch (e) {
		log.error("Failed to add user " + name, e);
		throw e;
	}
	return true;
};

ClientManager.prototype.updateUser = function(name, opts, callback) {
	const users = this.getUsers();
	if (users.indexOf(name) === -1) {
		return false;
	}
	if (typeof opts === "undefined") {
		return false;
	}

	let user = this.readUserConfig(name);
	const currentUser = JSON.stringify(user, null, "\t");
	_.assign(user, opts);
	const newUser = JSON.stringify(user, null, "\t");

	// Do not touch the disk if object has not changed
	if (currentUser === newUser) {
		return callback ? callback() : true;
	}

	fs.writeFile(Helper.getUserConfigPath(name), newUser, (err) => {
		if (err) {
			log.error("Failed to update user", err);
		}

		if (callback) {
			callback(err);
		}
	});
};

ClientManager.prototype.readUserConfig = function(name) {
	var users = this.getUsers();
	if (users.indexOf(name) === -1) {
		return false;
	}
	var data = fs.readFileSync(Helper.getUserConfigPath(name), "utf-8");
	return JSON.parse(data);
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

ClientManager.prototype.addUserPromise = function(data) {
	let self = this;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then(
				(users) => {
					if (users.indexOf(data.name) !== -1) {
						reject(false);
						throw new Error("User " + data.name + " already exist.");
					}
					if (require("path").basename(data.name) !== data.name) {
						reject(false);
						throw new Error(data.name + " is an invalid username.");
					}
					const user = {
						user: data.name,
						password: data.password || "",
						log: data.enableLog,
						networks: []
					};
					fs.writeFile(Helper.getUserConfigPath(data.name),
						JSON.stringify(user, null, "\t"),
						"utf-8",
						(err) => {
							if (err) {
								reject(err);
							} else {
								resolve(true);
							}
						}
					);
				}
			)
			.catch(
				(err) => {
					log.error(`Error adding user ${colors.bold(data.name)}.`, err.message);
				}
			);
	});
};

ClientManager.prototype.updateUserPromise = function(data) {
	let self = this;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then(
				(users) => {
					if (users.indexOf(data.name) === -1) {
						reject(false);
						throw new Error(data.name + " does not exist.");
					}
					if (typeof data.opts === "undefined") {
						reject(false);
						throw new Error("Options are not set");
					}
					self.readUserConfigPromise(data.name)
						.then(
							(user) => {
								const currentUser = JSON.stringify(user, null, "\t");
								_.assign(user, data.opts);
								const newUser = JSON.stringify(user, null, "\t");
								// Do not touch the disk if object has not changed
								if (currentUser === newUser) {
									resolve(true);
								} else {
									fs.writeFile(Helper.getUserConfigPath(data.name),
										newUser,
										"utf-8",
										(err) => {
											if (err) {
												reject(err);
											} else {
												resolve(true);
											}
										}
									);
								}
							}
						);
				}
			)
			.catch(
				(err) => {
					log.error("Failed to Update user.", err.message);
				}
			);
	});
};

ClientManager.prototype.removeUserPromise = function(name) {
	let self = this;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then((users) => {
				if (users.indexOf(name) === -1) {
					throw new Error(`User ${colors.bold(name)} does not exist.`);
				} else {
					fs.unlink(Helper.getUserConfigPath(name),
					(err) => {
						if (err) {
							reject(err);
						} else {
							resolve(true);
						}
					});
				}
			})
			.catch(
				(err) => {
					log.error("Failed to remove user.", err.message);
					return err;
				}
			);
	});
};

ClientManager.prototype.getUsersPromise = function() {
	return new Promise((resolve, reject) => {
		fs.readdir(Helper.USERS_PATH,
				(err, files) => {
					if (err) {
						reject(err);
					}					else {
						var users = [];
						files.forEach(file => {
							if (file.indexOf(".json") !== -1) {
								users.push(file.replace(".json", ""));
							}
						});
						resolve(users);
					}
				}
			);
	}
	);
};

ClientManager.prototype.readUserConfigPromise = function(name) {
	let self = this;
	return new Promise((resolve, reject) => {
		self.getUsersPromise()
			.then(
				(users) => {
					if (users.indexOf(name) === -1) {
						reject(false);
						throw new Error("No config file with that user name: " + name);
					}
				}
			).then(
				() => {
					fs.readFile(Helper.getUserConfigPath(name), "utf-8",
						(err, data) => {
							if (err) {
								reject(err);
							} else {
								resolve(JSON.parse(data));
							}
						}
					);
				}
			).catch(
				(err) => {
					log.error("Failed to read user config", err);
				}
			);
	}
	);
};
