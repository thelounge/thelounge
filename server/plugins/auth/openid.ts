import log from "../../log";
import Config from "../../config";
import type {AuthHandler} from "../auth";

const openIDAuth: AuthHandler = (manager, client, user, _, callback) => {
	if (user === "") {
		log.error(`Authentication failed`);
		return callback(false);
	}

	// If no user is found, create it
	if (!client) {
		manager.addUser(user, null, true);
	}

	return callback(true);
};

function isOpenIDEnabled() {
	return !Config.values.public && Config.values.openid.enable;
}

export default {
	moduleName: "openid",
	auth: openIDAuth,
	isEnabled: isOpenIDEnabled,
};
