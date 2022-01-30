"use strict";

const Helper = require("../../helper");

function headerAuth(manager, client, user, password, callback) {
	// If no user is found, create it
	if (!client) {
		manager.addUser(user, null, true);
	}

	return callback(true);
}

function isHeaderAuthEnabled() {
	return !Helper.config.public && Helper.config.headerAuth.enable;
}

module.exports = {
	moduleName: "header",
	auth: headerAuth,
	isEnabled: isHeaderAuthEnabled,
};
