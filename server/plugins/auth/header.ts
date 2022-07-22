import log from "../../log";
import Config from "../../config";
import type {AuthHandler} from "../auth";

const headerAuth: AuthHandler = (manager, client, user, password, callback) => {
	if (user === "") {
		log.error(
			`Authentication failed using header auth: empty username. Have you selected the right header?`
		);
		return callback(false);
	}

	// If no user is found, create it
	if (!client) {
		manager.addUser(user, null, true);
	}

	return callback(true);
};

function isHeaderAuthEnabled() {
	return !Config.values.public && Config.values.headerAuth.enable;
}

export default {
	moduleName: "header",
	auth: headerAuth,
	isEnabled: isHeaderAuthEnabled,
};
