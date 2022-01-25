"use strict";

const log = require("../../log");
const Helper = require("../../helper");
const colors = require("chalk");

function headerAuth(manager, client, user, password, callback) {
	// If no user is found, create it
	if (!client) {
		if (Helper.config.headerAuth.createNewUsers) {
			manager.addUser(user, Math.random().toString(), Helper.config.headerAuth.logNewUsers);
		} else {
			return callback(false);
		}
	}
	return callback(true);
}

function isHeaderAuthEnabled() {
	return !Helper.config.public && Helper.config.headerAuth.enabled && Helper.config.reverseProxy;
}

module.exports = {
	moduleName: "header",
	auth: headerAuth,
	isEnabled: isHeaderAuthEnabled,
};
