import path from "node:path";
import fs, {Stats} from "node:fs";
import os from "node:os";
import _ from "lodash";
import colors from "chalk";
import {SearchOptions} from "ldapts";
import {pathToFileURL} from "node:url";
import type {ConnectionOptions as TlsConnectionOptions} from "node:tls";

import log from "./log.js";
import Helper from "./helper.js";
import Utils from "./command-line/utils.js";
import Network from "./models/network.js";

export type WebIRC = {
	[key: string]: unknown;
};

type Https = {
	enable: boolean;
	key: string;
	certificate: string;
	ca: string;
};

type FileUpload = {
	enable: boolean;
	maxFileSize: number;
	baseUrl?: string;
};

export type Defaults = Pick<
	Network,
	| "name"
	| "host"
	| "port"
	| "password"
	| "tls"
	| "rejectUnauthorized"
	| "nick"
	| "username"
	| "realname"
	| "leaveMessage"
	| "sasl"
	| "saslAccount"
	| "saslPassword"
> & {
	join: string;
};

type Identd = {
	enable: boolean;
	port: number;
};

type SearchDN = {
	rootDN: string;
	rootPassword: string;
	filter: string;
	base: string;
	scope: SearchOptions["scope"];
};

type Ldap = {
	enable: boolean;
	url: string;
	tlsOptions: TlsConnectionOptions;
	primaryKey: string;
	searchDN: SearchDN;
	baseDN?: string;
};

type Debug = {
	ircFramework: boolean;
	raw: boolean;
};

type StoragePolicy = {
	enabled: boolean;
	maxAgeDays: number;
	deletionPolicy: "statusOnly" | "everything";
};

export type ConfigType = {
	public: boolean;
	host: string | undefined;
	port: number;
	bind: string | undefined;
	reverseProxy: boolean;
	maxHistory: number;
	https: Https;
	theme: string;
	prefetch: boolean;
	disableMediaPreview: boolean;
	prefetchStorage: boolean;
	prefetchMaxImageSize: number;
	prefetchMaxSearchSize: number;
	prefetchTimeout: number;
	fileUpload: FileUpload;
	transports: string[];
	leaveMessage: string;
	defaults: Defaults;
	lockNetwork: boolean;
	messageStorage: string[];
	storagePolicy: StoragePolicy;
	useHexIp: boolean;
	webirc?: WebIRC;
	identd: Identd;
	oidentd?: string;
	ldap: Ldap;
	debug: Debug;
	themeColor: string;
};

import defaultConfig from "../defaults/config.js";

class Config {
	values = {..._.cloneDeep(defaultConfig), themeColor: ""} as unknown as ConfigType;
	#homePath = "";

	getHomePath() {
		return this.#homePath;
	}

	getConfigPath() {
		return path.join(this.#homePath, "config.js");
	}

	getUserLogsPath() {
		return path.join(this.#homePath, "logs");
	}

	getStoragePath() {
		return path.join(this.#homePath, "storage");
	}

	getFileUploadPath() {
		return path.join(this.#homePath, "uploads");
	}

	getUsersPath() {
		return path.join(this.#homePath, "users");
	}

	getUserConfigPath(name: string) {
		return path.join(this.getUsersPath(), `${name}.json`);
	}

	getClientCertificatesPath() {
		return path.join(this.#homePath, "certificates");
	}

	getPackagesPath() {
		return path.join(this.#homePath, "packages");
	}

	getPackageModulePath(packageName: string) {
		return path.join(this.getPackagesPath(), "node_modules", packageName);
	}

	getDefaultNick() {
		if (!this.values.defaults.nick) {
			return "thelounge";
		}

		return this.values.defaults.nick.replace(/%/g, () =>
			Math.floor(Math.random() * 10).toString()
		);
	}

	merge(newConfig: ConfigType) {
		this._merge_config_objects(this.values, newConfig);
	}

	_merge_config_objects(oldConfig: ConfigType, newConfig: ConfigType) {
		// semi exposed function so that we can test it
		// it mutates the oldConfig, but returns it as a convenience for testing

		for (const key in newConfig) {
			if (!Object.prototype.hasOwnProperty.call(oldConfig, key)) {
				log.warn(`Unknown key "${colors.bold(key)}", please verify your config.`);
			}
		}

		return _.mergeWith(oldConfig, newConfig, (objValue, srcValue, key) => {
			// Do not override config variables if the type is incorrect (e.g. object changed into a string)
			if (
				typeof objValue !== "undefined" &&
				objValue !== null &&
				typeof objValue !== typeof srcValue
			) {
				log.warn(`Incorrect type for "${colors.bold(key)}", please verify your config.`);

				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return objValue;
			}

			// For arrays, simply override the value with user provided one.
			if (_.isArray(objValue)) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return srcValue;
			}
		});
	}

	async setHome(newPath: string) {
		this.#homePath = Helper.expandHome(newPath);

		// Reload config from new home location
		const configPath = this.getConfigPath();

		if (fs.existsSync(configPath)) {
			try {
				const configUrl = pathToFileURL(configPath).href;
				const userConfigModule = await import(configUrl);
				const userConfig = userConfigModule.default || userConfigModule;

				if (_.isEmpty(userConfig)) {
					log.warn(
						`The file located at ${colors.green(
							configPath
						)} does not appear to expose anything.`
					);
					log.warn(
						`Make sure it is non-empty and the configuration is exported using ${colors.bold(
							"export default { ... }"
						)}.`
					);
					log.warn("Using default configuration...");
				}

				this.merge(userConfig);
			} catch (error) {
				log.error(`Failed to load config from ${configPath}:`, String(error));
				log.warn("Using default configuration...");
			}
		}

		if (this.values.fileUpload.baseUrl) {
			try {
				new URL("test/file.png", this.values.fileUpload.baseUrl);
			} catch (e: unknown) {
				this.values.fileUpload.baseUrl = undefined;

				log.warn(
					`The ${colors.bold("fileUpload.baseUrl")} you specified is invalid: ${String(
						e
					)}`
				);
			}
		}

		const manifestPath = Utils.getFileFromRelativeToRoot("public", "thelounge.webmanifest");

		// Check if manifest exists, if not, the app most likely was not built
		// Skip this check in test environment
		if (!fs.existsSync(manifestPath)) {
			if (process.env.NODE_ENV !== "test") {
				log.error(
					`The client application was not built. Run ${colors.bold(
						"NODE_ENV=production yarn build"
					)} to resolve this.`
				);
				process.exit(1);
			}
		} else {
			// Load theme color from the web manifest
			const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
			this.values.themeColor = manifest.theme_color;
		}

		// log dir probably shouldn't be world accessible.
		// Create it with the desired permission bits if it doesn't exist yet.
		let logsStat: Stats | undefined = undefined;

		const userLogsPath = this.getUserLogsPath();

		try {
			logsStat = fs.statSync(userLogsPath);
		} catch {
			// ignored on purpose, node v14.17.0 will give us {throwIfNoEntry: false}
		}

		if (!logsStat) {
			try {
				fs.mkdirSync(userLogsPath, {recursive: true, mode: 0o750});
			} catch (e: unknown) {
				log.error("Unable to create logs directory", String(e));
			}
		} else if (logsStat && logsStat.mode & 0o001) {
			log.warn(
				userLogsPath,
				"is world readable.",
				"The log files may be exposed. Please fix the permissions."
			);

			if (os.platform() !== "win32") {
				log.warn(`run \`chmod o-x "${userLogsPath}"\` to correct it.`);
			}
		}
	}
}

export default new Config();
