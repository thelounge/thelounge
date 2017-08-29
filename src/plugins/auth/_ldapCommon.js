var Helper = require("../../helper");
var ldap = require("ldapjs");

function ldapAuthCommon(manager, client, user, bindDN, password, callback) {
	var config = Helper.config;

	var ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions
	});

	ldapclient.on("error", function(err) {
		log.error("Unable to connect to LDAP server", err);
		callback(!err);
	});

	ldapclient.bind(bindDN, password, function(err) {
		if (!err && !client) {
			manager.addUser(user, null)
		}
		ldapclient.unbind();
		callback(!err);
	});
}


module.exports = ldapAuthCommon;

