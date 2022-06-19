import colors from "chalk";
import log from "../../log";
import Helper from "../../helper";
import type {AuthHandler} from "../auth";

const localAuth: AuthHandler = (manager, client, user, password, callback) => {
	// If no user is found, or if the client has not provided a password,
	// fail the authentication straight away
	if (!client || !password) {
		return callback(false);
	}

	// If this user has no password set, fail the authentication
	if (!client.config.password) {
		log.error(
			`User ${colors.bold(
				user
			)} with no local password set tried to sign in. (Probably a LDAP user)`
		);
		return callback(false);
	}

	Helper.password
		.compare(password, client.config.password)
		.then((matching) => {
			if (matching && Helper.password.requiresUpdate(client.config.password)) {
				const hash = Helper.password.hash(password);

				client.setPassword(hash, (success) => {
					if (success) {
						log.info(
							`User ${colors.bold(
								client.name
							)} logged in and their hashed password has been updated to match new security requirements`
						);
					}
				});
			}

			callback(matching);
		})
		.catch((error) => {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			log.error(`Error while checking users password. Error: ${error}`);
		});
};

export default {
	moduleName: "local",
	auth: localAuth,
	isEnabled: () => true,
};
