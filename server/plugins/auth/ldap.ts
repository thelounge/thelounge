import ldap, {SearchOptions} from "ldapjs";
import colors from "chalk";

import log from "../../log";
import Config, {ConfigType} from "../../config";
import type {AuthHandler} from "../auth";

function ldapAuthCommon(
	user: string,
	bindDN: string,
	password: string,
	callback: (success: boolean) => void
) {
	const config = Config.values;

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions,
	});

	ldapclient.on("error", function (err: Error) {
		log.error(`Unable to connect to LDAP server: ${err.toString()}`);
		callback(false);
	});

	ldapclient.bind(bindDN, password, function (err) {
		ldapclient.unbind();

		if (err) {
			log.error(`LDAP bind failed: ${err.toString()}`);
			callback(false);
		} else {
			callback(true);
		}
	});
}

function simpleLdapAuth(user: string, password: string, callback: (success: boolean) => void) {
	if (!user || !password) {
		return callback(false);
	}

	const config = Config.values;

	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
	const bindDN = `${config.ldap.primaryKey}=${userDN},${config.ldap.baseDN || ""}`;

	log.info(`Auth against LDAP ${config.ldap.url} with provided bindDN ${bindDN}`);

	ldapAuthCommon(user, bindDN, password, callback);
}

/**
 * LDAP auth using initial DN search (see config comment for ldap.searchDN)
 */
function advancedLdapAuth(user: string, password: string, callback: (success: boolean) => void) {
	if (!user || !password) {
		return callback(false);
	}

	const config = Config.values;
	const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions,
	});

	const base = config.ldap.searchDN.base;
	const searchOptions: SearchOptions = {
		scope: config.ldap.searchDN.scope,
		filter: `(&(${config.ldap.primaryKey}=${userDN})${config.ldap.searchDN.filter})`,
		attributes: ["dn"],
	};

	ldapclient.on("error", function (err: Error) {
		log.error(`Unable to connect to LDAP server: ${err.toString()}`);
		callback(false);
	});

	ldapclient.bind(config.ldap.searchDN.rootDN, config.ldap.searchDN.rootPassword, function (err) {
		if (err) {
			log.error("Invalid LDAP root credentials");
			ldapclient.unbind();
			callback(false);
			return;
		}

		ldapclient.search(base, searchOptions, function (err2, res) {
			if (err2) {
				log.warn(`LDAP User not found: ${userDN}`);
				ldapclient.unbind();
				callback(false);
				return;
			}

			let found = false;

			res.on("searchEntry", function (entry) {
				found = true;
				const bindDN = entry.objectName;
				log.info(`Auth against LDAP ${config.ldap.url} with found bindDN ${bindDN || ""}`);
				ldapclient.unbind();

				// TODO: Fix type !
				ldapAuthCommon(user, bindDN!, password, callback);
			});

			res.on("error", function (err3: Error) {
				log.error(`LDAP error: ${err3.toString()}`);
				callback(false);
			});

			res.on("end", function (result) {
				ldapclient.unbind();

				if (!found) {
					log.warn(
						`LDAP Search did not find anything for: ${userDN} (${
							result?.status.toString() || "unknown"
						})`
					);
					callback(false);
				}
			});
		});
	});
}

const ldapAuth: AuthHandler = (manager, client, user, password, callback) => {
	// TODO: Enable the use of starttls() as an alternative to ldaps

	// TODO: move this out of here and get rid of `manager` and `client` in
	// auth plugin API
	function callbackWrapper(valid: boolean) {
		if (valid && !client) {
			manager.addUser(user, null, true);
		}

		callback(valid);
	}

	let auth: typeof simpleLdapAuth | typeof advancedLdapAuth;

	if ("baseDN" in Config.values.ldap) {
		auth = simpleLdapAuth;
	} else {
		auth = advancedLdapAuth;
	}

	return auth(user, password, callbackWrapper);
};

/**
 * Use the LDAP filter from config to check that users still exist before loading them
 * via the supplied callback function.
 */

function advancedLdapLoadUsers(users: string[], callbackLoadUser) {
	const config = Config.values;

	const ldapclient = ldap.createClient({
		url: config.ldap.url,
		tlsOptions: config.ldap.tlsOptions,
	});

	const base = config.ldap.searchDN.base;

	ldapclient.on("error", function (err: Error) {
		log.error(`Unable to connect to LDAP server: ${err.toString()}`);
	});

	ldapclient.bind(config.ldap.searchDN.rootDN, config.ldap.searchDN.rootPassword, function (err) {
		if (err) {
			log.error("Invalid LDAP root credentials");
			return true;
		}

		const remainingUsers = new Set(users);

		const searchOptions: SearchOptions = {
			scope: config.ldap.searchDN.scope,
			filter: `${config.ldap.searchDN.filter}`,
			attributes: [config.ldap.primaryKey],
			paged: true,
		};

		ldapclient.search(base, searchOptions, function (err2, res) {
			if (err2) {
				log.error(`LDAP search error: ${err2?.toString()}`);
				return true;
			}

			res.on("searchEntry", function (entry) {
				const user = entry.attributes[0].vals[0].toString();

				if (remainingUsers.has(user)) {
					remainingUsers.delete(user);
					callbackLoadUser(user);
				}
			});

			res.on("error", function (err3) {
				log.error(`LDAP error: ${err3.toString()}`);
			});

			res.on("end", function () {
				remainingUsers.forEach((user) => {
					log.warn(
						`No account info in LDAP for ${colors.bold(
							user
						)} but user config file exists`
					);
				});
			});
		});

		ldapclient.unbind();
	});

	return true;
}

function ldapLoadUsers(users: string[], callbackLoadUser) {
	if ("baseDN" in Config.values.ldap) {
		// simple LDAP case can't test for user existence without access to the
		// user's unhashed password, so indicate need to fallback to default
		// loadUser behaviour by returning false
		return false;
	}

	return advancedLdapLoadUsers(users, callbackLoadUser);
}

function isLdapEnabled() {
	return !Config.values.public && Config.values.ldap.enable;
}

export type LdapConfig = ConfigType["ldap"];

import type {
	AuthProvider,
	AuthenticateParams,
	AuthResult,
	AuthStartParams,
	AuthStartInfo,
	DisconnectParams,
	GetValidUsersParams,
	LogoutParams,
	LogoutInfo,
} from "./types";

export class SimpleLDAPAuthProvider implements AuthProvider {
	name = "ldap";
	canChangePassword = false;

	async init(): Promise<void> {}

	getValidUsers({users}: GetValidUsersParams): Promise<string[]> {
		// Simple LDAP can't test for user existence without the user's
		// unhashed password, so return all users unchanged
		return Promise.resolve(users);
	}

	authStart(_params: AuthStartParams): AuthStartInfo {
		return {};
	}

	async authenticate({
		manager,
		client,
		username,
		password,
	}: AuthenticateParams): Promise<AuthResult> {
		return new Promise((resolve) => {
			simpleLdapAuth(username, password, (valid) => {
				if (valid && !client) {
					manager.addUser(username, null, true);
				}

				if (valid) {
					resolve({success: true, username});
				} else {
					resolve({success: false});
				}
			});
		});
	}

	logout(_params: LogoutParams): LogoutInfo {
		return {};
	}

	disconnect(_params: DisconnectParams): void {}
}

export class AdvancedLDAPAuthProvider implements AuthProvider {
	name = "ldap";
	canChangePassword = false;

	config: LdapConfig;

	constructor(config: LdapConfig) {
		this.config = config;
	}

	async init(): Promise<void> {}

	async getValidUsers({users}: GetValidUsersParams): Promise<string[]> {
		return new Promise((resolve) => {
			const validUsers: string[] = [];

			const ldapclient = ldap.createClient({
				url: this.config.url,
				tlsOptions: this.config.tlsOptions,
			});

			const base = this.config.searchDN.base;

			ldapclient.on("error", function (err: Error) {
				log.error(`Unable to connect to LDAP server: ${err.toString()}`);
				resolve(users);
			});

			ldapclient.bind(
				this.config.searchDN.rootDN,
				this.config.searchDN.rootPassword,
				(err) => {
					if (err) {
						log.error("Invalid LDAP root credentials");
						resolve(users);
						return;
					}

					const userSet = new Set(users);

					const searchOptions: SearchOptions = {
						scope: this.config.searchDN.scope,
						filter: `${this.config.searchDN.filter}`,
						attributes: [this.config.primaryKey],
						paged: true,
					};

					ldapclient.search(base, searchOptions, function (err2, res) {
						if (err2) {
							log.error(`LDAP search error: ${err2?.toString()}`);
							resolve(users);
							return;
						}

						res.on("searchEntry", function (entry) {
							const user = entry.attributes[0].vals[0].toString();

							if (userSet.has(user)) {
								validUsers.push(user);
							}
						});

						res.on("error", function (err3) {
							log.error(`LDAP error: ${err3.toString()}`);
							ldapclient.unbind();
							resolve(users);
						});

						res.on("end", function () {
							const validSet = new Set(validUsers);

							users.forEach((user) => {
								if (!validSet.has(user)) {
									log.warn(
										`No account info in LDAP for ${colors.bold(
											user
										)} but user config file exists`
									);
								}
							});

							ldapclient.unbind();
							resolve(validUsers);
						});
					});
				}
			);
		});
	}

	authStart(_params: AuthStartParams): AuthStartInfo {
		return {};
	}

	async authenticate({
		manager,
		client,
		username,
		password,
	}: AuthenticateParams): Promise<AuthResult> {
		return new Promise((resolve) => {
			advancedLdapAuth(username, password, (valid) => {
				if (valid && !client) {
					manager.addUser(username, null, true);
				}

				if (valid) {
					resolve({success: true, username});
				} else {
					resolve({success: false});
				}
			});
		});
	}

	logout(_params: LogoutParams): LogoutInfo {
		return {};
	}

	disconnect(_params: DisconnectParams): void {}
}

export default {
	moduleName: "ldap",
	auth: ldapAuth,
	isEnabled: isLdapEnabled,
	loadUsers: ldapLoadUsers,
};
