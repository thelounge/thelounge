import colors from "chalk";
import log from "../../log";
import Helper from "../../helper";
import type {AuthHandler} from "../auth";
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

const localAuth: AuthHandler = (_manager, client, user, password, callback) => {
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
			log.error(`Error while checking users password. Error: ${error}`);
		});
};

export class LocalAuthProvider implements AuthProvider {
	name = "local";
	canChangePassword = true;

	async init(): Promise<void> {}

	async getValidUsers({users}: GetValidUsersParams): Promise<string[]> {
		return users;
	}

	authStart(_params: AuthStartParams): AuthStartInfo {
		return {};
	}

	async authenticate({client, username, password}: AuthenticateParams): Promise<AuthResult> {
		if (!client || !password) {
			return {success: false};
		}

		if (!client.config.password) {
			log.error(
				`User ${colors.bold(
					username
				)} with no local password set tried to sign in. (Probably a LDAP user)`
			);
			return {success: false};
		}

		let matching: boolean;

		try {
			matching = await Helper.password.compare(password, client.config.password);
		} catch (error) {
			log.error(`Error while checking users password. Error: ${error}`);
			return {success: false};
		}

		if (!matching) {
			return {success: false};
		}

		if (Helper.password.requiresUpdate(client.config.password)) {
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

		return {success: true, username};
	}

	logout(_params: LogoutParams): LogoutInfo {
		return {};
	}

	disconnect(_params: DisconnectParams): void {}
}

export default {
	moduleName: "local",
	auth: localAuth,
	isEnabled: () => true,
};
