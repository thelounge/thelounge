"use strict";

var Helper = require("../../helper");
var _ldapAuthCommon = require("./_ldapCommon");

function ldapAuth(manager, client, user, password, callback) {
	if (!user) {
		return callback(false);
	}

	var config = Helper.config;

	var userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
	var bindDN = config.ldap.primaryKey + "=" + userDN + "," + config.ldap.baseDN;

	log.info("Auth against LDAP ", config.ldap.url, " with provided bindDN ", bindDN);

	_ldapAuthCommon(manager, client, user, bindDN, password, callback);
}

module.exports = ldapAuth;
