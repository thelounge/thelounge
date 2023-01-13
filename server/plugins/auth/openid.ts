import colors from "chalk";

import log from "../../log";
import Config from "../../config";
import type {AuthHandler} from "../auth";
import * as express from "express";

function openidAuthCommon(
	user: string,
	bindDN: string,
	password: string,
	callback: (success: boolean) => void
) {
	const config = Config.values;
}

function openIDCheckSession(user: string, password: string, callback: (success: boolean) => void) {
	if (!user || !password) {
		return callback(false);
	}
	// If success
	callback(true);
}

const openIDAuth: AuthHandler = (manager, client, user, password, callback) => {
	function callbackWrapper(valid: boolean) {
		if (valid && !client) {
			manager.addUser(user, null, true);
		}

		callback(valid);
	}

	//return auth(user, password, callbackWrapper);
	return false;
};

function openIDLoadUsers(users: string[], callbackLoadUser) {
	return false;
}

function isOpenIDEnabled() {
	return !Config.values.public && Config.values.openid.enable;
}

export default {
	moduleName: "openid",
	auth: openIDAuth,
	isEnabled: isOpenIDEnabled,
	loadUsers: openIDLoadUsers,
};
