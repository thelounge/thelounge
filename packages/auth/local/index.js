const Helper = require("./helper");

async function localAuth(api, client, providerData) {
	const user = providerData && providerData.user;
	const password = providerData && providerData.password;

	// If no user is found, or if the client has not provided a password,
	// fail the authentication straight away
	if (!password) {
		api.Logger.error(`No password specified!`);
		return false;
	}

	// If this user has no password set, fail the authentication
	if (!client.config.password) {
		api.Logger.error(`User ${user} with no password tried to sign in`);
		return false;
	}

	return await Helper.password
		.compare(password, client.config.password)
		.then((matching) => {
			if (matching && Helper.password.requiresUpdate(client.config.password)) {
				const hash = Helper.password.hash(password);

				client.setPassword(hash, (success) => {
					if (success) {
						api.Logger.info(
							`User ${user} logged in and their hashed password has been updated to match new security requirements`
						);
					}
				});
			}

			return matching;
		})
		.catch((error) => {
			api.Logger.error(`Error while checking users password. Error: ${error}`);
			return false;
		});
}

module.exports = {
	onServerStart(api) {
		api.Logger.info("LOADED!");
		api.Auth.register((client, data) => localAuth(api, client, data));
	},
};
