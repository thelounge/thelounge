import {Client, InvalidCredentialsError, SearchOptions} from "ldapts";
import colors from "chalk";

import log from "../../log";
import Config from "../../config";
import type {AuthHandler} from "../auth";

type ErrorWithCode = NodeJS.ErrnoException & Error;

const CONNECTION_ERROR_CODES = new Set([
    "ECONNREFUSED",
    "ECONNRESET",
    "ENOTFOUND",
    "ETIMEDOUT",
    "EHOSTUNREACH",
    "EAI_AGAIN",
]);

function errorToString(err: unknown): string {
    if (err instanceof Error) {
        return err.toString();
    }

    return String(err);
}

function isConnectionError(err: unknown): boolean {
    if (!err || typeof err !== "object") {
        return false;
    }

    const code = (err as ErrorWithCode).code;

    if (code && CONNECTION_ERROR_CODES.has(code)) {
        return true;
    }

    if (typeof (err as Error).message === "string") {
        const message = (err as Error).message;

        for (const possibleCode of CONNECTION_ERROR_CODES) {
            if (message.includes(possibleCode)) {
                return true;
            }
        }
    }

    return false;
}

async function safeUnbind(client: Client) {
    try {
        await client.unbind();
    } catch {
        // Ignore unbind errors
    }
}

async function ldapAuthCommon(
    user: string,
    bindDN: string,
    password: string,
    callback: (success: boolean) => void
) {
    const config = Config.values;

    const ldapclient = new Client({
        url: config.ldap.url,
        tlsOptions: config.ldap.tlsOptions,
    });

    let success = false;
    let caughtError: unknown;

    try {
        await ldapclient.bind(bindDN, password);
        success = true;
    } catch (err) {
        caughtError = err;
    }

    await safeUnbind(ldapclient);

    if (success) {
        callback(true);
        return;
    }

    if (caughtError) {
        if (isConnectionError(caughtError)) {
            log.error(`Unable to connect to LDAP server: ${errorToString(caughtError)}`);
        } else {
            log.error(`LDAP bind failed: ${errorToString(caughtError)}`);
        }
    } else {
        log.error("LDAP bind failed");
    }

    callback(false);
}

function simpleLdapAuth(user: string, password: string, callback: (success: boolean) => void) {
    if (!user || !password) {
        return callback(false);
    }

    const config = Config.values;

    const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");
    const bindDN = `${config.ldap.primaryKey}=${userDN},${config.ldap.baseDN || ""}`;

    log.info(`Auth against LDAP ${config.ldap.url} with provided bindDN ${bindDN}`);

    void ldapAuthCommon(user, bindDN, password, callback);
}

/**
 * LDAP auth using initial DN search (see config comment for ldap.searchDN)
 */
function advancedLdapAuth(user: string, password: string, callback: (success: boolean) => void) {
    if (!user || !password) {
        callback(false);
        return;
    }

    const config = Config.values;
    const userDN = user.replace(/([,\\/#+<>;"= ])/g, "\\$1");

    void (async () => {
        const ldapclient = new Client({
            url: config.ldap.url,
            tlsOptions: config.ldap.tlsOptions,
        });

        const base = config.ldap.searchDN.base;
        const searchOptions: SearchOptions = {
            scope: config.ldap.searchDN.scope,
            filter: `(&(${config.ldap.primaryKey}=${userDN})${config.ldap.searchDN.filter})`,
            attributes: ["dn"],
        };

        try {
            await ldapclient.bind(config.ldap.searchDN.rootDN, config.ldap.searchDN.rootPassword);
        } catch (err) {
            if (err instanceof InvalidCredentialsError) {
                log.error("Invalid LDAP root credentials");
            } else if (isConnectionError(err)) {
                log.error(`Unable to connect to LDAP server: ${errorToString(err)}`);
            } else {
                log.error(`LDAP error: ${errorToString(err)}`);
            }

            await safeUnbind(ldapclient);
            callback(false);
            return;
        }

        let searchResult;

        try {
            searchResult = await ldapclient.search(base, searchOptions);
        } catch (err) {
            if (isConnectionError(err)) {
                log.error(`Unable to connect to LDAP server: ${errorToString(err)}`);
            } else {
                log.warn(`LDAP User not found: ${userDN}`);
            }

            await safeUnbind(ldapclient);
            callback(false);
            return;
        }

        await safeUnbind(ldapclient);

        if (!searchResult.searchEntries.length) {
            log.warn(`LDAP Search did not find anything for: ${userDN} (0)`);
            callback(false);
            return;
        }

        const bindDN = searchResult.searchEntries[0].dn;
        log.info(`Auth against LDAP ${config.ldap.url} with found bindDN ${bindDN}`);

        void ldapAuthCommon(user, bindDN, password, callback);
    })();
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

    void (async () => {
        const ldapclient = new Client({
            url: config.ldap.url,
            tlsOptions: config.ldap.tlsOptions,
        });

        try {
            await ldapclient.bind(config.ldap.searchDN.rootDN, config.ldap.searchDN.rootPassword);
        } catch (err) {
            if (err instanceof InvalidCredentialsError) {
                log.error("Invalid LDAP root credentials");
            } else if (isConnectionError(err)) {
                log.error(`Unable to connect to LDAP server: ${errorToString(err)}`);
            } else {
                log.error(`LDAP error: ${errorToString(err)}`);
            }

            await safeUnbind(ldapclient);
            return;
        }

        const remainingUsers = new Set(users);
        const base = config.ldap.searchDN.base;

        const searchOptions: SearchOptions = {
            scope: config.ldap.searchDN.scope,
            filter: `${config.ldap.searchDN.filter}`,
            attributes: [config.ldap.primaryKey],
            paged: true,
        };

        let searchResult;

        try {
            searchResult = await ldapclient.search(base, searchOptions);
        } catch (err) {
            if (isConnectionError(err)) {
                log.error(`Unable to connect to LDAP server: ${errorToString(err)}`);
            } else {
                log.error(`LDAP search error: ${errorToString(err)}`);
            }

            await safeUnbind(ldapclient);
            return;
        }

        await safeUnbind(ldapclient);

        for (const entry of searchResult.searchEntries) {
            const userAttr = entry[config.ldap.primaryKey];
            const user = Array.isArray(userAttr) ? userAttr[0] : userAttr;
            const userStr = typeof user === "string" ? user : String(user);

            if (remainingUsers.has(userStr)) {
                remainingUsers.delete(userStr);
                callbackLoadUser(userStr);
            }
        }

        remainingUsers.forEach((user) => {
            log.warn(
                `No account info in LDAP for ${colors.bold(
                    user
                )} but user config file exists`
            );
        });
    })();

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

export default {
    moduleName: "ldap",
    auth: ldapAuth,
    isEnabled: isLdapEnabled,
    loadUsers: ldapLoadUsers,
};
