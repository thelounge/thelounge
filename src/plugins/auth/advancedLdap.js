var Helper = require("../../helper");
var ldap = require("ldapjs");

var _ldapAuthCommon = require("./_ldapCommon");

/**
 * LDAP auth using initial DN search (see config comment for ldap.searchDN)
 */
function advancedLdapAuth(manager, client, user, password, callback) {
	if (!user) {
		return callback(false);
	}

	var config = Helper.config;
	var userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");

	var ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions
	});

	var base = config.ldap.searchDN.base;
	var searchOptions = {
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
					var found = false;
					res.on("searchEntry", function(entry) {
						found = true;
						var bindDN = entry.objectName;
						log.info("Auth against LDAP ", config.ldap.url, " with found bindDN ", bindDN);
						ldapclient.unbind();

						_ldapAuthCommon(manager, client, user, bindDN, password, callback);
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

module.exports = advancedLdapAuth;
