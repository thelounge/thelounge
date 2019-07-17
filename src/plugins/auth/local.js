"use strict";

const log = require("../../log");
const Helper = require("../../helper");
const colors = require("chalk");

function localAuth(manager, client, user, password, callback) {
	// If no user is found, or if the client has not provided a password,
	// fail the authentication straight away
	if (!client || !password) {
		return callback(false);
	}

	// If this user has no password set, fail the authentication
	if (!client.config.password) {
		log.error(
			`User ${colors.bold(
				user
			)} with no local password set tried to sign in. (Probably a LDAP user)`
		);
		return callback(false);
	}

	Helper.password
		.compare(password, client.config.password)
		.then((matching) => {
			if (matching && Helper.password.requiresUpdate(client.config.password)) {
				const hash = Helper.password.hash(password);

				client.setPassword(hash, (success) => {
					if (success) {
						log.info(
							`User ${colors.bold(
								client.name
							)} logged in and their hashed password has been updated to match new security requirements`
						);
					}
				});
			}

			callback(matching);
		})
		.catch((error) => {
			log.error(`Error while checking users password. Error: ${error}`);
		});
}

module.exports = {
	auth: localAuth,
	isEnabled: () => true,
};
