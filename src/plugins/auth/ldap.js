"use strict";

const Helper = require("../../helper");
const ldap = require("ladpjs");

function ldapAuthCommon(manager, client, user, bindDN, password, callback) {
	const config = Helper.config;

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions
	});

	ldapclient.on("error", function(err) {
		log.error("Unable to connect to LDAP server", err);
		callback(!err);
	});

	ldapclient.bind(bindDN, password, function(err) {
		if (!err && !client) {
			manager.addUser(user, null);
		}
		ldapclient.unbind();
		callback(!err);
	});
}

function simpleLdapAuth(manager, client, user, password, callback) {
	if (!user) {
		return callback(false);
	}

	const config = Helper.config;

	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
	const bindDN = config.ldap.primaryKey + "=" + userDN + "," + config.ldap.baseDN;

	log.info("Auth against LDAP ", config.ldap.url, " with provided bindDN ", bindDN);

	ldapAuthCommon(manager, client, user, bindDN, password, callback);
}

/**
 * LDAP auth using initial DN search (see config comment for ldap.searchDN)
 */
function advancedLdapAuth(manager, client, user, password, callback) {
	if (!user) {
		return callback(false);
	}

	const config = Helper.config;
	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions
	});

	const base = config.ldap.searchDN.base;
	const searchOptions = {
		scope: config.ldap.searchDN.scope,
		filter: "(&(" + config.ldap.primaryKey + "=" + userDN + ")" + config.ldap.searchDN.filter + ")",
		attributes: ["dn"]
	};

	ldapclient.on("error", function(err) {
		log.error("Unable to connect to LDAP server", err);
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
					log.warning("User not found: ", userDN);
					ldapclient.unbind();
					callback(false);
				} else {
					let found = false;
					res.on("searchEntry", function(entry) {
						found = true;
						const bindDN = entry.objectName;
						log.info("Auth against LDAP ", config.ldap.url, " with found bindDN ", bindDN);
						ldapclient.unbind();

						ldapAuthCommon(manager, client, user, bindDN, password, callback);
					});
					res.on("error", function(err3) {
						log.error("LDAP error: ", err3);
						callback(false);
					});
					res.on("end", function() {
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
	let auth = function() {};
	if ("baseDN" in Helper.config.ldap) {
		auth = simpleLdapAuth;
	} else {
		auth = advancedLdapAuth;
	}
	return auth(manager, client, user, password, callback);
}

function isLdapEnabled() {
	return !Helper.config.public && Helper.config.ldap.enable;
}

module.exports = {
	auth: ldapAuth,
	isEnabled: isLdapEnabled
};
