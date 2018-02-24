"use strict";

const Helper = require("../../helper");

// Forked ldapjs for 2 reasons:
// 1. Removed bunyan https://github.com/joyent/node-ldapjs/pull/399
// 2. Remove dtrace-provider dependency
const ldap = require("thelounge-ldapjs-non-maintained-fork");

function ldapAuthCommon(user, bindDN, password, callback) {
	const config = Helper.config;

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions,
	});

	ldapclient.on("error", function(err) {
		log.error(`Unable to connect to LDAP server: ${err}`);
		callback(!err);
	});

	ldapclient.bind(bindDN, password, function(err) {
		ldapclient.unbind();
		callback(!err);
	});
}

function simpleLdapAuth(user, password, callback) {
	if (!user || !password) {
		return callback(false);
	}

	const config = Helper.config;

	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
	const bindDN = `${config.ldap.primaryKey}=${userDN},${config.ldap.baseDN}`;

	log.info(`Auth against LDAP ${config.ldap.url} with provided bindDN ${bindDN}`);

	ldapAuthCommon(user, bindDN, password, callback);
}

/**
 * LDAP auth using initial DN search (see config comment for ldap.searchDN)
 */
function advancedLdapAuth(user, password, callback) {
	if (!user || !password) {
		return callback(false);
	}

	const config = Helper.config;
	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions,
	});

	const base = config.ldap.searchDN.base;
	const searchOptions = {
		scope: config.ldap.searchDN.scope,
		filter: `(&(${config.ldap.primaryKey}=${userDN})${config.ldap.searchDN.filter})`,
		attributes: ["dn"],
	};

	ldapclient.on("error", function(err) {
		log.error(`Unable to connect to LDAP server: ${err}`);
		callback(!err);
	});

	ldapclient.bind(config.ldap.searchDN.rootDN, config.ldap.searchDN.rootPassword, function(err) {
		if (err) {
			log.error("Invalid LDAP root credentials");
			ldapclient.unbind();
			callback(false);
		} else {
			ldapclient.search(base, searchOptions, function(err2, res) {
				if (err2) {
					log.warn(`User not found: ${userDN}`);
					ldapclient.unbind();
					callback(false);
				} else {
					let found = false;
					res.on("searchEntry", function(entry) {
						found = true;
						const bindDN = entry.objectName;
						log.info(`Auth against LDAP ${config.ldap.url} with found bindDN ${bindDN}`);
						ldapclient.unbind();

						ldapAuthCommon(user, bindDN, password, callback);
					});
					res.on("error", function(err3) {
						log.error(`LDAP error: ${err3}`);
						callback(false);
					});
					res.on("end", function() {
						ldapclient.unbind();

						if (!found) {
							callback(false);
						}
					});
				}
			});
		}
	});
}

function ldapAuth(manager, client, user, password, callback) {
	// TODO: Enable the use of starttls() as an alternative to ldaps

	// TODO: move this out of here and get rid of `manager` and `client` in
	// auth plugin API
	function callbackWrapper(valid) {
		if (valid && !client) {
			manager.addUser(user, null, true);
		}

		callback(valid);
	}

	let auth;

	if ("baseDN" in Helper.config.ldap) {
		auth = simpleLdapAuth;
	} else {
		auth = advancedLdapAuth;
	}

	return auth(user, password, callbackWrapper);
}

function isLdapEnabled() {
	return !Helper.config.public && Helper.config.ldap.enable;
}

module.exports = {
	auth: ldapAuth,
	isEnabled: isLdapEnabled,
};
