import _ from "lodash";
import colors from "chalk";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import Auth from "./plugins/auth";
import Client, {UserConfig} from "./client";
import Config from "./config";
import {NetworkConfig} from "./models/network";
import WebPush from "./plugins/webpush";
import log from "./log";
import {Server} from "socket.io";

class ClientManager {
	clients: Client[];
	sockets!: Server;
	identHandler: any;
	webPush!: WebPush;

	constructor() {
		this.clients = [];
	}

	init(identHandler, sockets: Server) {
		this.sockets = sockets;
		this.identHandler = identHandler;
		this.webPush = new WebPush();

		if (!Config.values.public) {
			this.loadUsers();

			// LDAP does not have user commands, and users are dynamically
			// created upon logon, so we don't need to watch for new files
			if (!Config.values.ldap.enable) {
				this.autoloadUsers();
			}
		}
	}

	findClient(name: string) {
		name = name.toLowerCase();
		return this.clients.find((u) => u.name.toLowerCase() === name);
	}

	loadUsers() {
		let users = this.getUsers();

		if (users.length === 0) {
			log.info(
				`There are currently no users. Create one with ${colors.bold(
					"thelounge add <name>"
				)}.`
			);

			return;
		}

		const alreadySeenUsers = new Set();
		users = users.filter((user) => {
			user = user.toLowerCase();

			if (alreadySeenUsers.has(user)) {
				log.error(
					`There is more than one user named "${colors.bold(
						user
					)}". Usernames are now case insensitive, duplicate users will not load.`
				);

				return false;
			}

			alreadySeenUsers.add(user);

			return true;
		});

		// This callback is used by Auth plugins to load users they deem acceptable
		const callbackLoadUser = (user) => {
			this.loadUser(user);
		};

		if (!Auth.loadUsers(users, callbackLoadUser)) {
			// Fallback to loading all users
			users.forEach((name) => this.loadUser(name));
		}
	}

	autoloadUsers() {
		fs.watch(
			Config.getUsersPath(),
			_.debounce(
				() => {
					const loaded = this.clients.map((c) => c.name);
					const updatedUsers = this.getUsers();

					if (updatedUsers.length === 0) {
						log.info(
							`There are currently no users. Create one with ${colors.bold(
								"thelounge add <name>"
							)}.`
						);
					}

					// Reload all users. Existing users will only have their passwords reloaded.
					updatedUsers.forEach((name) => this.loadUser(name));

					// Existing users removed since last time users were loaded
					_.difference(loaded, updatedUsers).forEach((name) => {
						const client = _.find(this.clients, {name});

						if (client) {
							client.quit(true);
							this.clients = _.without(this.clients, client);
							log.info(`User ${colors.bold(name)} disconnected and removed.`);
						}
					});
				},
				1000,
				{maxWait: 10000}
			)
		);
	}

	loadUser(name: string) {
		const userConfig = this.readUserConfig(name);

		if (!userConfig) {
			return;
		}

		let client = this.findClient(name);

		if (client) {
			if (userConfig.password !== client.config.password) {
				/**
				 * If we happen to reload an existing client, make super duper sure we
				 * have their latest password. We're not replacing the entire config
				 * object, because that could have undesired consequences.
				 *
				 * @see https://github.com/thelounge/thelounge/issues/598
				 */
				client.config.password = userConfig.password;
				log.info(`Password for user ${colors.bold(name)} was reset.`);
			}
		} else {
			client = new Client(this, name, userConfig);
			client.connect();
			this.clients.push(client);
		}

		return client;
	}

	getUsers = function () {
		if (!fs.existsSync(Config.getUsersPath())) {
			return [];
		}

		return fs
			.readdirSync(Config.getUsersPath())
			.filter((file) => file.endsWith(".json"))
			.map((file) => file.slice(0, -5));
	};

	addUser(name: string, password: string | null, enableLog?: boolean) {
		if (path.basename(name) !== name) {
			throw new Error(`${name} is an invalid username.`);
		}

		const userPath = Config.getUserConfigPath(name);

		if (fs.existsSync(userPath)) {
			log.error(`User ${colors.green(name)} already exists.`);
			return false;
		}

		const user = {
			password: password || "",
			log: enableLog,
		};

		try {
			fs.writeFileSync(userPath, JSON.stringify(user, null, "\t"), {
				mode: 0o600,
			});
		} catch (e: any) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			log.error(`Failed to create user ${colors.green(name)} (${e})`);
			throw e;
		}

		try {
			const userFolderStat = fs.statSync(Config.getUsersPath());
			const userFileStat = fs.statSync(userPath);

			if (
				userFolderStat &&
				userFileStat &&
				(userFolderStat.uid !== userFileStat.uid || userFolderStat.gid !== userFileStat.gid)
			) {
				log.warn(
					`User ${colors.green(
						name
					)} has been created, but with a different uid (or gid) than expected.`
				);
				log.warn(
					"The file owner has been changed to the expected user. " +
						"To prevent any issues, please run thelounge commands " +
						"as the correct user that owns the config folder."
				);
				log.warn(
					"See https://thelounge.chat/docs/usage#using-the-correct-system-user for more information."
				);
				fs.chownSync(userPath, userFolderStat.uid, userFolderStat.gid);
			}
		} catch (e: any) {
			// We're simply verifying file owner as a safe guard for users
			// that run `thelounge add` as root, so we don't care if it fails
		}

		return true;
	}

	getDataToSave(client: Client) {
		const json = Object.assign({}, client.config, {
			networks: client.networks.map((n) => n.export()),
		});
		const newUser = JSON.stringify(json, null, "\t");
		const newHash = crypto.createHash("sha256").update(newUser).digest("hex");

		return {newUser, newHash};
	}

	saveUser(client: Client, callback?: (err?: any) => void) {
		const {newUser, newHash} = this.getDataToSave(client);

		// Do not write to disk if the exported data hasn't actually changed
		if (client.fileHash === newHash) {
			return;
		}

		const pathReal = Config.getUserConfigPath(client.name);
		const pathTemp = pathReal + ".tmp";

		try {
			// Write to a temp file first, in case the write fails
			// we do not lose the original file (for example when disk is full)
			fs.writeFileSync(pathTemp, newUser, {
				mode: 0o600,
			});
			fs.renameSync(pathTemp, pathReal);

			return callback ? callback() : true;
		} catch (e: any) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			log.error(`Failed to update user ${colors.green(client.name)} (${e})`);

			if (callback) {
				callback(e);
			}
		}
	}

	removeUser(name) {
		const userPath = Config.getUserConfigPath(name);

		if (!fs.existsSync(userPath)) {
			log.error(`Tried to remove non-existing user ${colors.green(name)}.`);
			return false;
		}

		fs.unlinkSync(userPath);

		return true;
	}

	private readUserConfig(name: string) {
		const userPath = Config.getUserConfigPath(name);

		if (!fs.existsSync(userPath)) {
			log.error(`Tried to read non-existing user ${colors.green(name)}`);
			return false;
		}

		try {
			const data = fs.readFileSync(userPath, "utf-8");
			return JSON.parse(data) as UserConfig;
		} catch (e: any) {
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			log.error(`Failed to read user ${colors.bold(name)}: ${e}`);
		}

		return false;
	}
}

export default ClientManager;
