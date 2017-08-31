"use strict";

const ldapAuth = require("../../../src/plugins/auth/ldap");
const Helper = require("../../../src/helper");
const ldap = require("ldapjs");
const expect = require("chai").expect;

const user = "johndoe";
const wrongUser = "eve";
const correctPassword = "loremipsum";
const wrongPassword = "dolorsitamet";
const baseDN = "ou=accounts,dc=example,dc=com";
const primaryKey = "uid";
const serverPort = 1389;

function normalizeDN(dn) {
	return ldap.parseDN(dn).toString();
}

function startLdapServer(callback) {
	const server = ldap.createServer();

	const searchConf = Helper.config.ldap.searchDN;
	const userDN = primaryKey + "=" + user + "," + baseDN;

	// Two users are authorized: john doe and the root user in case of
	// advanced auth (the user that does the search for john's actual
	// bindDN)
	const authorizedUsers = {};
	authorizedUsers[normalizeDN(searchConf.rootDN)] = searchConf.rootPassword;
	authorizedUsers[normalizeDN(userDN)] = correctPassword;

	function authorize(req, res, next) {
		const bindDN = req.connection.ldap.bindDN;

		if (bindDN in authorizedUsers) {
			return next();
		}

		return next(new ldap.InsufficientAccessRightsError());
	}

	Object.keys(authorizedUsers).forEach(function(dn) {
		server.bind(dn, function(req, res, next) {
			const bindDN = req.dn.toString();
			const password = req.credentials;

			if (bindDN in authorizedUsers && authorizedUsers[bindDN] === password) {
				req.connection.ldap.bindDN = req.dn;
				res.end();
				return next();
			}

			return next(new ldap.InsufficientAccessRightsError());
		});
	});

	server.search(searchConf.base, authorize, function(req, res) {
		const obj = {
			dn: userDN,
			attributes: {
				objectclass: ["person", "top"],
				cn: ["john doe"],
				sn: ["johnny"],
				uid: ["johndoe"],
				memberof: [baseDN]
			}
		};

		if (req.filter.matches(obj.attributes)) {
			// TODO: check req.scope if ldapjs does not
			res.send(obj);
		}

		res.end();
	});

	server.listen(serverPort, function() {
		console.log("LDAP server listening at %s", server.url);
		callback();
	});

	return server;
}

function testLdapAuth(done) {
	// Create mock manager and client. When client is true, manager should not
	// be used. But ideally the auth plugin should not use any of those.
	const manager = {};
	const client = true;

	// Wrap calls into promises to execute them in parallel and wait
	// for both before calling done()

	it("should successfully authenticate with correct password", function(done) {
		ldapAuth.auth(manager, client, user, correctPassword, function(valid) {
			expect(valid).to.equal(true);
			done();
		});
	});

	it("should fail to authenticate with incorrect password", function(done) {
		ldapAuth.auth(manager, client, user, wrongPassword, function(valid) {
			expect(valid).to.equal(false);
			done();
		});
	});

	it("should fail to authenticate with incorrect username", function(done) {
		ldapAuth.auth(manager, client, wrongUser, correctPassword, function(valid) {
			expect(valid).to.equal(false);
			done();
		});
	});
}

describe("LDAP authentication plugin", function() {
	before(function(done) {
		this.server = startLdapServer(done);
	});
	after(function(done) {
		this.server.close();
		done();
	});

	beforeEach(function(done) {
		Helper.config.public = false;
		Helper.config.ldap.enable = true;
		Helper.config.ldap.url = "ldap://localhost:" + String(serverPort);
		Helper.config.ldap.primaryKey = primaryKey;
		done();
	});

	describe("LDAP authentication availability", function() {
		it("checks that the configuration is correctly tied to isEnabled()", function(done) {
			Helper.config.ldap.enable = true;
			expect(ldapAuth.isEnabled()).to.equal(true);
			Helper.config.ldap.enable = false;
			expect(ldapAuth.isEnabled()).to.equal(false);
			done();
		});
	});

	describe("Simple LDAP authentication (predefined DN pattern)", function() {
		Helper.config.ldap.baseDN = baseDN;
		testLdapAuth();
	});

	describe("Advanced LDAP authentication (DN found by a prior search query)", function() {
		delete Helper.config.ldap.baseDN;
		testLdapAuth();
	});
});

