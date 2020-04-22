"use strict";

const log = require("../log");
const colors = require("chalk");

// The order defines priority: the first available plugin is used.
// Always keep 'local' auth plugin at the end of the list; it should always be enabled.
const plugins = [require("./auth/ldap"), require("./auth/local")];

function unimplemented(funcName) {
	log.debug(
		`Auth module ${colors.bold(
			module.exports.moduleName
		)} doesn't implement function ${colors.bold(funcName)}`
	);
}

// Default API implementations
module.exports = {
	moduleName: "<module with no name>",

	// Must override: implements authentication mechanism
	auth: () => unimplemented("auth"),

	// Optional to override: implements filter for loading users at start up
	// This allows an auth plugin to check if a user is still acceptable, if the plugin
	// can do so without access to the user's unhashed password.
	// Returning 'false' triggers fallback to default behaviour of loading all users
	loadUsers: () => false,
};

// local auth should always be enabled, but check here to verify
let somethingEnabled = false;

// Override default API stubs with exports from first enabled plugin found
for (const plugin of plugins) {
	if (plugin.isEnabled()) {
		somethingEnabled = true;

		for (const name in plugin) {
			module.exports[name] = plugin[name];
		}

		break;
	}
}

if (!somethingEnabled) {
	log.error("None of the auth plugins is enabled");
}
