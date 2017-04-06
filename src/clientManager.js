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
	self.getUsersPromise()
		.then((users)=>{
			users.forEach(name => self.loadUser(name));
		})
		.then(() => {
			fs.watch(Helper.USERS_PATH, _.debounce(() => {
				const loaded = self.clients.map(c => c.name);
				self.getUsersPromise()
					.then((updatedUsers) => {
					// New users created since last time users were loaded
						_.difference(updatedUsers, loaded).forEach(name => self.loadUser(name));

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
