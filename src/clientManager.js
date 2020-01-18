"use strict";

const _ = require("lodash");
const log = require("./log");
const colors = require("chalk");
const crypto = require("crypto");
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

	if (!Helper.config.public) {
		this.loadUsers();

		// LDAP does not have user commands, and users are dynamically
		// created upon logon, so we don't need to watch for new files
		if (!Helper.config.ldap.enable) {
			this.autoloadUsers();
		}
	}
};

ClientManager.prototype.findClient = function(name) {
	return this.clients.find((u) => u.name === name);
};

ClientManager.prototype.loadUsers = function() {
	const users = this.getUsers();

	if (users.length === 0) {
		log.info(
			`There are currently no users. Create one with ${colors.bold("thelounge add <name>")}.`
		);
	}

	users.forEach((name) => this.loadUser(name));
};

ClientManager.prototype.autoloadUsers = function() {
	fs.watch(
		Helper.getUsersPath(),
		_.debounce(
			() => {
				const loaded = this.clients.map((c) => c.name);
				const updatedUsers = this.getUsers();

				if (updatedUsers.length === 0) {
					log.info(
						`There are currently no users. Create one with ${colors.bold(
							"thelounge add <name>"
						)}.`
					);
				}

				// Reload all users. Existing users will only have their passwords reloaded.
				updatedUsers.forEach((name) => this.loadUser(name));

				// Existing users removed since last time users were loaded
				_.difference(loaded, updatedUsers).forEach((name) => {
					const client = _.find(this.clients, {name});

					if (client) {
						client.quit(true);
						this.clients = _.without(this.clients, client);
						log.info(`User ${colors.bold(name)} disconnected and removed.`);
					}
				});
			},
			1000,
			{maxWait: 10000}
		)
	);
};

ClientManager.prototype.loadUser = function(name) {
	const userConfig = readUserConfig(name);

	if (!userConfig) {
		return;
	}

	let client = this.findClient(name);

	if (client) {
		if (userConfig.password !== client.config.password) {
			/**
			 * If we happen to reload an existing client, make super duper sure we
			 * have their latest password. We're not replacing the entire config
			 * object, because that could have undesired consequences.
			 *
			 * @see https://github.com/thelounge/thelounge/issues/598
			 */
			client.config.password = userConfig.password;
			log.info(`Password for user ${colors.bold(name)} was reset.`);
		}
	} else {
		client = new Client(this, name, userConfig);
		this.clients.push(client);
	}

	return client;
};

ClientManager.prototype.getUsers = function() {
	return fs
		.readdirSync(Helper.getUsersPath())
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
		log: enableLog,
	};

	try {
		fs.writeFileSync(userPath, JSON.stringify(user, null, "\t"));
	} catch (e) {
		log.error(`Failed to create user ${colors.green(name)} (${e})`);
		throw e;
	}

	try {
		const userFolderStat = fs.statSync(Helper.getUsersPath());
		const userFileStat = fs.statSync(userPath);

		if (
			userFolderStat &&
			userFileStat &&
			(userFolderStat.uid !== userFileStat.uid || userFolderStat.gid !== userFileStat.gid)
		) {
			log.warn(
				`User ${colors.green(
					name
				)} has been created, but with a different uid (or gid) than expected.`
			);
			log.warn(
				"The file owner has been changed to the expected user. " +
					"To prevent any issues, please run thelounge commands " +
					"as the correct user that owns the config folder."
			);
			log.warn(
				"See https://thelounge.chat/docs/usage#using-the-correct-system-user for more information."
			);
			fs.chownSync(userPath, userFolderStat.uid, userFolderStat.gid);
		}
	} catch (e) {
		// We're simply verifying file owner as a safe guard for users
		// that run `thelounge add` as root, so we don't care if it fails
	}

	return true;
};

ClientManager.prototype.getDataToSave = function(client) {
	const json = Object.assign({}, client.config, {
		networks: client.networks.map((n) => n.export()),
	});
	const newUser = JSON.stringify(json, null, "\t");
	const newHash = crypto
		.createHash("sha256")
		.update(newUser)
		.digest("hex");

	return {newUser, newHash};
};

ClientManager.prototype.saveUser = function(client, callback) {
	const {newUser, newHash} = this.getDataToSave(client);

	// Do not write to disk if the exported data hasn't actually changed
	if (client.fileHash === newHash) {
		return;
	}

	const pathReal = Helper.getUserConfigPath(client.name);
	const pathTemp = pathReal + ".tmp";

	try {
		// Write to a temp file first, in case the write fails
		// we do not lose the original file (for example when disk is full)
		fs.writeFileSync(pathTemp, newUser);
		fs.renameSync(pathTemp, pathReal);

		return callback ? callback() : true;
	} catch (e) {
		log.error(`Failed to update user ${colors.green(client.name)} (${e})`);

		if (callback) {
			callback(e);
		}
	}
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

	try {
		const data = fs.readFileSync(userPath, "utf-8");
		return JSON.parse(data);
	} catch (e) {
		log.error(`Failed to read user ${colors.bold(name)}: ${e}`);
	}

	return false;
}
