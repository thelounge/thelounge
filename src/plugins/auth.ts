import colors from "chalk";
import Client from "../client";
import ClientManager from "../clientManager";
import log from "../log";

export type AuthHandler = (
	manager: ClientManager,
	client: Client,
	user: string,
	password: string,
	callback: (success: boolean) => void
) => void;

// The order defines priority: the first available plugin is used.
// Always keep 'local' auth plugin at the end of the list; it should always be enabled.
const plugins = [import("./auth/ldap"), import("./auth/local")];

const toExport = {
	moduleName: "<module with no name>",

	// Must override: implements authentication mechanism
	auth: () => unimplemented("auth"),

	// Optional to override: implements filter for loading users at start up
	// This allows an auth plugin to check if a user is still acceptable, if the plugin
	// can do so without access to the user's unhashed password.
	// Returning 'false' triggers fallback to default behaviour of loading all users
	loadUsers: () => false,
	// local auth should always be enabled, but check here to verify
	initialized: false,
	// TODO: fix typing
	async initialize() {
		if (toExport.initialized) {
			return;
		}

		// Override default API stubs with exports from first enabled plugin found
		const resolvedPlugins = await Promise.all(plugins);

		for (const {default: plugin} of resolvedPlugins) {
			if (plugin.isEnabled()) {
				toExport.initialized = true;

				for (const name in plugin) {
					toExport[name] = plugin[name];
				}

				break;
			}
		}

		if (!toExport.initialized) {
			log.error("None of the auth plugins is enabled");
		}
	},
} as any;

function unimplemented(funcName: string) {
	log.debug(
		`Auth module ${colors.bold(toExport.moduleName)} doesn't implement function ${colors.bold(
			funcName
		)}`
	);
}

// Default API implementations
export default toExport;
