"use strict";

const Helper = require("../../helper");
const log = require("../../log");

function headerAuth(manager, client, user, password, callback) {
	if (user === "") {
		log.error(
			`Authentication failed using header auth: empty username. Have you selected the right header?`
		);
		return callback(false);
	}

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
