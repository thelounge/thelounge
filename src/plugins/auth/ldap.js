"use strict";

const Helper = require("../../helper");
const _ldapAuthCommon = require("./_ldapCommon");

function ldapAuth(manager, client, user, password, callback) {
	if (!user) {
		return callback(false);
	}

	const config = Helper.config;

	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
	const bindDN = config.ldap.primaryKey + "=" + userDN + "," + config.ldap.baseDN;

	log.info("Auth against LDAP ", config.ldap.url, " with provided bindDN ", bindDN);

	_ldapAuthCommon(manager, client, user, bindDN, password, callback);
}

module.exports = ldapAuth;
