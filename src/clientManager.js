"use strict";

const _ = require("lodash");
const colors = require("colors/safe");
const fs = require("fs");
const path = require("path");
const Client = require("./client");
const Helper = require("./helper");
const WebPush = require("./plugins/webpush");

module.exports = ClientManager;

function ClientManager() {
	this.clients = [];
}

ClientManager.prototype.init = function(identHandler, sockets) {
	this.sockets = sockets;
	this.identHandler = identHandler;
	this.webPush = new WebPush();

	if (!Helper.config.public && !Helper.config.ldap.enable) {
		// TODO: Remove deprecated warning in v3.0.0
		if ("autoload" in Helper.config) {
			log.warn(`Autoloading users is now always enabled. Please remove the ${colors.yellow("autoload")} option from your configuration file.`);
		}

		this.autoloadUsers();
	}
};

ClientManager.prototype.findClient = function(name) {
	return this.clients.find((u) => u.name === name);
};

ClientManager.prototype.autoloadUsers = function() {
	const users = this.getUsers();
	const noUsersWarning = `There are currently no users. Create one with ${colors.bold("lounge add <name>")}.`;

	if (users.length === 0) {
		log.info(noUsersWarning);
	}

	users.forEach((name) => this.loadUser(name));

	fs.watch(Helper.USERS_PATH, _.debounce(() => {
		const loaded = this.clients.map((c) => c.name);
		const updatedUsers = this.getUsers();

		if (updatedUsers.length === 0) {
			log.info(noUsersWarning);
		}

		// New users created since last time users were loaded
		_.difference(updatedUsers, loaded).forEach((name) => this.loadUser(name));

		// Existing users removed since last time users were loaded
		_.difference(loaded, updatedUsers).forEach((name) => {
			const client = _.find(this.clients, {name: name});
			if (client) {
				client.quit(true);
				this.clients = _.without(this.clients, client);
				log.info(`User ${colors.bold(name)} disconnected and removed.`);
			}
		});
	}, 1000, {maxWait: 10000}));
};

ClientManager.prototype.loadUser = function(name) {
	const user = readUserConfig(name);

	if (!user) {
		return;
	}

	let client = this.findClient(name);

	if (client) {
		log.warn(`Tried to load user ${colors.bold(name)}, which is already loaded.`);
		return client;
	}

	client = new Client(this, name, user);
	this.clients.push(client);

	return client;
};

ClientManager.prototype.getUsers = function() {
	return fs
		.readdirSync(Helper.USERS_PATH)
		.filter((file) => file.endsWith(".json"))
		.map((file) => file.slice(0, -5));
};

ClientManager.prototype.addUser = function(name, password, enableLog) {
	if (path.basename(name) !== name) {
		throw new Error(`${name} is an invalid username.`);
	}

	const userPath = Helper.getUserConfigPath(name);

	if (fs.existsSync(userPath)) {
		log.error(`User ${colors.green(name)} already exists.`);
		return false;
	}

	const user = {
		password: password || "",
		log: enableLog || false,
		awayMessage: "",
		networks: [],
		sessions: {},
	};

	try {
		fs.writeFileSync(userPath, JSON.stringify(user, null, "\t"));
	} catch (e) {
		log.error(`Failed to create user ${colors.green(name)} (${e})`);
		throw e;
	}

	return true;
};

ClientManager.prototype.updateUser = function(name, opts, callback) {
	const user = readUserConfig(name);

	if (!user) {
		log.error(`Tried to update invalid user ${colors.green(name)}. This is most likely a bug.`);
		return false;
	}

	const currentUser = JSON.stringify(user, null, "\t");
	_.assign(user, opts);
	const newUser = JSON.stringify(user, null, "\t");

	// Do not touch the disk if object has not changed
	if (currentUser === newUser) {
		return callback ? callback() : true;
	}

	fs.writeFile(Helper.getUserConfigPath(name), newUser, (err) => {
		if (err) {
			log.error(`Failed to update user ${colors.green(name)}. (${err})`);
		}

		if (callback) {
			callback(err);
		}
	});
};

ClientManager.prototype.removeUser = function(name) {
	const userPath = Helper.getUserConfigPath(name);

	if (!fs.existsSync(userPath)) {
		log.error(`Tried to remove non-existing user ${colors.green(name)}.`);
		return false;
	}

	fs.unlinkSync(userPath);

	return true;
};

function readUserConfig(name) {
	const userPath = Helper.getUserConfigPath(name);

	if (!fs.existsSync(userPath)) {
		log.error(`Tried to read non-existing user ${colors.green(name)}`);
		return false;
	}

	const data = fs.readFileSync(userPath, "utf-8");
	return JSON.parse(data);
}
