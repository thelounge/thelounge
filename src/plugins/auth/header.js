"use strict";

const Helper = require("../../helper");

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
	return !Helper.config.public && Helper.config.headerAuth.enabled;
}

module.exports = {
	moduleName: "header",
	auth: headerAuth,
	isEnabled: isHeaderAuthEnabled,
};
