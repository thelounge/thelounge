import {Persistence} from "./persistence/persistence";
import {Store} from "express-session";
import Client from "./client";
import Config from "./config";
import Uploader from "./plugins/uploader";
import _ from "lodash";
import {NetworkWithIrcFramework} from "./models/network";
import Helper from "./helper";
import log from "./log";
import changelog from "./plugins/changelog";
import packages from "./plugins/packages";
import {ChanType} from "../shared/types/chan";
import inputs from "./plugins/inputs";
import type {AuthPerformData} from "../shared/types/socket-events";
import {Request} from "express";
import {Socket, User} from "./server";
import ClientManager from "./clientManager";
import dns from "dns";
import net from "net";
import {
	ConfigNetDefaults,
	LockedConfigNetDefaults,
	LockedSharedConfiguration,
	SharedConfiguration,
} from "../shared/types/config";
import themes from "./plugins/packages/themes";
import {Session} from "./persistence/models/Session";

function initializeClient(
	socket: Socket,
	persistence: Persistence,
	sessionStore: Store,
	manager: ClientManager,
	client: Client,
	userSession: Session,
	lastMessage: number,
	openChannel: number
) {
	socket.emit("auth:success");

	client.clientAttach(socket.id, userSession.externalId!);

	// Client sends currently active channel on reconnect,
	// pass it into `open` directly so it is verified and updated if necessary
	if (openChannel) {
		client.open(socket.id, openChannel);

		// If client provided channel passes checks, use it. if client has invalid
		// channel open (or windows like settings) then use last known server active channel
		openChannel = client.attachedClients[socket.id].openChannel || client.lastActiveChannel;
	} else {
		openChannel = client.lastActiveChannel;
	}

	if (Config.values.fileUpload.enable) {
		new Uploader();
	}

	socket.on("disconnect", function () {
		process.nextTick(() => client.clientDetach(socket.id));
	});

	socket.on("input", (data) => {
		if (_.isPlainObject(data)) {
			client.input(data);
		}
	});

	socket.on("more", (data) => {
		if (_.isPlainObject(data)) {
			const history = client.more(data);

			if (history !== null) {
				socket.emit("more", history);
			}
		}
	});

	socket.on("network:new", (data) => {
		if (_.isPlainObject(data)) {
			// prevent people from overriding webirc settings
			data.uuid = null;
			data.commands = null;
			data.ignoreList = null;

			client.connectToNetwork(data);
		}
	});

	socket.on("network:get", (data) => {
		if (typeof data !== "string") {
			return;
		}

		const network = _.find(client.networks, {uuid: data});

		if (!network) {
			return;
		}

		socket.emit("network:info", network.exportForEdit());
	});

	socket.on("network:edit", (data) => {
		if (!_.isPlainObject(data)) {
			return;
		}

		const network = _.find(client.networks, {uuid: data.uuid});

		if (!network) {
			return;
		}

		(network as NetworkWithIrcFramework).edit(client, data);
	});

	socket.on("history:clear", (data) => {
		if (!_.isPlainObject(data)) {
			return;
		}

		client.clearHistory(data);
	});

	if (!Config.values.public && !Config.values.ldap.enable) {
		socket.on("change-password", (data) => {
			if (!_.isPlainObject(data)) {
				return;
			}

			const old = data.old_password;
			const p1 = data.new_password;
			const p2 = data.verify_password;

			if (typeof p1 === "undefined" || p1 === "" || p1 !== p2) {
				socket.emit("change-password", {
					error: "",
					success: false,
				});
				return;
			}

			if (!Helper.password.compare(old || "", client.config.password)) {
				socket.emit("change-password", {
					error: "password_incorrect",
					success: false,
				});
				return;
			}

			const hash = Helper.password.hash(p1);

			client.setPassword(hash, (success: boolean) => {
				socket.emit("change-password", {
					success: success,
					error: success ? undefined : "update_failed",
				});
			});
		});
	}

	socket.on("open", (data) => {
		client.open(socket.id, data);
	});

	socket.on("sort:networks", (data) => {
		if (!_.isPlainObject(data)) {
			return;
		}

		if (!Array.isArray(data.order)) {
			return;
		}

		client.sortNetworks(data.order);
	});

	socket.on("sort:channels", (data) => {
		if (!_.isPlainObject(data)) {
			return;
		}

		if (!Array.isArray(data.order) || typeof data.network !== "string") {
			return;
		}

		client.sortChannels(data.network, data.order);
	});

	socket.on("names", (data) => {
		if (_.isPlainObject(data)) {
			client.names(data);
		}
	});

	socket.on("changelog", () => {
		Promise.all([changelog.fetch(), packages.outdated()])
			.then(([changelogData, packageUpdate]) => {
				changelogData.packages = packageUpdate;
				socket.emit("changelog", changelogData);
			})
			.catch((error: Error) => {
				log.error(`Error while fetching changelog. Error: ${error.message}`);
			});
	});

	// In public mode only one client can be connected,
	// so there's no need to handle msg:preview:toggle
	if (!Config.values.public) {
		socket.on("msg:preview:toggle", (data) => {
			if (_.isPlainObject(data)) {
				return;
			}

			const networkAndChan = client.find(data.target);
			const newState = Boolean(data.shown);

			if (!networkAndChan) {
				return;
			}

			// Process multiple message at once for /collapse and /expand commands
			if (Array.isArray(data.messageIds)) {
				for (const msgId of data.messageIds) {
					const message = networkAndChan.chan.findMessage(msgId);

					if (message) {
						for (const preview of message.previews) {
							preview.shown = newState;
						}
					}
				}

				return;
			}

			const message = data.msgId ? networkAndChan.chan.findMessage(data.msgId) : null;

			if (!message) {
				return;
			}

			const preview = data.link ? message.findPreview(data.link) : null;

			if (preview) {
				preview.shown = newState;
			}
		});
	}

	socket.on("mentions:get", () => {
		socket.emit("mentions:list", client.mentions);
	});

	socket.on("mentions:dismiss", (msgId) => {
		if (typeof msgId !== "number") {
			return;
		}

		client.mentions.splice(
			client.mentions.findIndex((m) => m.msgId === msgId),
			1
		);
	});

	socket.on("mentions:dismiss_all", () => {
		client.mentions = [];
	});

	if (!Config.values.public) {
		socket.on("push:register", (subscription) => {
			if (
				!Object.prototype.hasOwnProperty.call(
					client.config.sessions,
					userSession.externalId!
				)
			) {
				return;
			}

			const registration = client.registerPushSubscription(
				client.config.sessions[userSession.externalId!],
				subscription
			);

			if (registration) {
				client.manager.webPush.pushSingle(client, registration, {
					type: "notification",
					timestamp: Date.now(),
					title: "The Lounge",
					body: "🚀 Push notifications have been enabled",
				});
			}
		});

		socket.on("push:unregister", () =>
			client.unregisterPushSubscription(userSession.externalId!)
		);
	}

	const sendSessionList = () => {
		persistence
			.getAllSessions(userSession.username!)
			.then((sessions) => {
				socket.emit(
					"sessions:list",
					sessions.map((otherSession) => {
						return {
							current: userSession.externalId! === otherSession.externalId!,
							active: _.reduce(
								client.attachedClients,
								(count, attachedClient) =>
									count +
									(attachedClient.token === otherSession.externalId! ? 1 : 0),
								0
							),
							lastUse: otherSession.lastSeen!.getDate(),
							ip: otherSession.lastIp!,
							agent: otherSession.lastUserAgent!,
							token: otherSession.externalId!,
						};
					})
				);
			})
			.catch((error) => {
				log.error(`Could not retrieve sessions for user. Error: ${error.message}`);
			});
	};

	socket.on("sessions:get", sendSessionList);

	if (!Config.values.public) {
		socket.on("setting:set", (newSetting) => {
			if (!_.isPlainObject(newSetting)) {
				return;
			}

			if (
				typeof newSetting.value === "object" ||
				typeof newSetting.name !== "string" ||
				newSetting.name[0] === "_"
			) {
				return;
			}

			// We do not need to do write operations and emit events if nothing changed.
			if (client.config.clientSettings[newSetting.name] !== newSetting.value) {
				client.config.clientSettings[newSetting.name] = newSetting.value;

				// Pass the setting to all clients.
				client.emit("setting:new", {
					name: newSetting.name,
					value: newSetting.value,
				});

				client.save();

				if (newSetting.name === "highlights" || newSetting.name === "highlightExceptions") {
					client.compileCustomHighlights();
				} else if (newSetting.name === "awayMessage") {
					if (typeof newSetting.value !== "string") {
						newSetting.value = "";
					}

					client.awayMessage = newSetting.value;
				}
			}
		});

		socket.on("setting:get", () => {
			if (!Object.prototype.hasOwnProperty.call(client.config, "clientSettings")) {
				socket.emit("setting:all", {});
				return;
			}

			const clientSettings = client.config.clientSettings;
			socket.emit("setting:all", clientSettings);
		});

		socket.on("search", async (query) => {
			const results = await client.search(query);
			socket.emit("search:results", results);
		});

		socket.on("mute:change", ({target, setMutedTo}) => {
			const networkAndChan = client.find(target);

			if (!networkAndChan) {
				return;
			}

			const {chan, network} = networkAndChan;

			// If the user mutes the lobby, we mute the entire network.
			if (chan.type === ChanType.LOBBY) {
				for (const channel of network.channels) {
					if (channel.type !== ChanType.SPECIAL) {
						channel.setMuteStatus(setMutedTo);
					}
				}
			} else {
				if (chan.type !== ChanType.SPECIAL) {
					chan.setMuteStatus(setMutedTo);
				}
			}

			for (const attachedClient of Object.keys(client.attachedClients)) {
				manager.sockets.in(attachedClient).emit("mute:changed", {
					target,
					status: setMutedTo,
				});
			}

			client.save();
		});
	}

	socket.on("sign-out", (tokenToSignOut) => {
		// If no token provided, sign out the current session
		const externalId = tokenToSignOut || userSession.externalId!;

		persistence
			.getSessionByExternalId(externalId)
			.then((sessionToSignOut: Session) => {
				if (sessionToSignOut.username !== userSession.username) {
					throw new Error(`Attempt to sign out session of another user`);
				}

				// sessionStore.destroy expects the session ID (sid), not externalId
				sessionStore.destroy(sessionToSignOut.sid, (err) => {
					if (!err) {
						return;
					}

					throw new Error(`Failed destroying session in signout: ${err?.toString()}`);
				});
			})
			.catch((err: Error) => {
				log.warn(`No session found for sign out request: ${err.message}`);
			});

		delete client.config.sessions[externalId!];

		client.save();

		_.map(client.attachedClients, (attachedClient, socketId) => {
			if (attachedClient.token !== externalId!) {
				return;
			}

			const socketToRemove = manager.sockets.of("/").sockets.get(socketId);

			socketToRemove!.emit("sign-out");
			socketToRemove!.disconnect();
		});

		// Do not send updated session list if user simply logs out
		if (externalId !== userSession.externalId) {
			sendSessionList();
		}
	});

	// socket.join is a promise depending on the adapter.
	void socket.join(client.id);

	client.updateSession(userSession.externalId!, getClientIp(socket), socket.request);
	socket.emit("init", {
		active: openChannel,
		networks: client.networks.map((network) =>
			network.getFilteredClone(openChannel, lastMessage)
		),
	});
	socket.emit("commands", inputs.getCommands());
}

export const performAuthentication = (
	persistence: Persistence,
	sessionStore: Store,
	manager: ClientManager
) => {
	return async function (this: Socket, data: AuthPerformData) {
		if (!_.isPlainObject(data)) {
			return;
		}

		const socket = this;
		let client: Client | undefined;
		const username = ((socket.request as Request).user! as User).username;

		let userSession: Session;

		try {
			userSession = await persistence.getSession((socket.request as Request).session.id);
		} catch (err) {
			log.error("Failed to fetch session from DB");
			return;
		}

		// Passport JS ensures we only get to this point is user is valid and authenticated
		// Will add user if user does not yet have config, no-op otherwise
		manager.addUser(username, null, true, true);

		client = manager.findClient(username);

		if (!client) {
			client = manager.loadUser(username);

			if (!client) {
				throw new Error(`authCallback: ${username} not found after lookup`);
			}
		}

		// Configuration does not change during runtime of TL,
		// and the client listens to this event only once
		if (data && (!("hasConfig" in data) || !data.hasConfig)) {
			socket.emit("configuration", getClientConfiguration(manager));

			socket.emit(
				"push:issubscribed",
				userSession.externalId &&
					client.config.sessions[userSession.externalId]?.pushSubscription
					? true
					: false
			);
		}

		const clientIP = getClientIp(socket);

		client.config.browser = {
			ip: clientIP,
			isSecure: getClientSecure(socket),
			language: getClientLanguage(socket),
		};

		// If webirc is enabled perform reverse dns lookup
		if (Config.values.webirc) {
			reverseDnsLookup(clientIP, (hostname) => {
				client!.config.browser!.hostname = hostname;
			});
		}

		let lastMessage = -1;

		if (data && "lastMessage" in data && data.lastMessage) {
			lastMessage = data.lastMessage;
		}

		// TODO: bonkers, but for now good enough until we rewrite the logic properly
		// initializeClient will check for if(openChannel) and as 0 is falsey it does the fallback...
		let openChannel = 0;

		if (data && "openChannel" in data && data.openChannel) {
			openChannel = data.openChannel;
		}

		initializeClient(
			socket,
			persistence,
			sessionStore,
			manager,
			client,
			userSession,
			lastMessage,
			openChannel
		);
	};
};

function reverseDnsLookup(ip: string, callback: (hostname: string) => void) {
	// node can throw, even if we provide valid input based on the DNS server
	// returning SERVFAIL it seems: https://github.com/thelounge/thelounge/issues/4768
	// so we manually resolve with the ip as a fallback in case something fails
	try {
		dns.reverse(ip, (reverseErr, hostnames) => {
			if (reverseErr || hostnames.length < 1) {
				return callback(ip);
			}

			dns.resolve(
				hostnames[0],
				net.isIP(ip) === 6 ? "AAAA" : "A",
				(resolveErr, resolvedIps) => {
					// TODO: investigate SoaRecord class
					if (!Array.isArray(resolvedIps)) {
						return callback(ip);
					}

					if (resolveErr || resolvedIps.length < 1) {
						return callback(ip);
					}

					for (const resolvedIp of resolvedIps) {
						if (ip === resolvedIp) {
							return callback(hostnames[0]);
						}
					}

					return callback(ip);
				}
			);
		});
	} catch (err) {
		log.error(`failed to resolve rDNS for ${ip}, using ip instead`, (err as any).toString());
		setImmediate(callback, ip); // makes sure we always behave asynchronously
	}
}

function getClientLanguage(socket: Socket): string | undefined {
	const acceptLanguage = socket.handshake.headers["accept-language"];

	if (typeof acceptLanguage === "string" && /^[\x00-\x7F]{1,50}$/.test(acceptLanguage)) {
		// only allow ASCII strings between 1-50 characters in length
		return acceptLanguage;
	}

	return undefined;
}

function getClientIp(socket: Socket): string {
	let ip = socket.handshake.address || "127.0.0.1";

	if (Config.values.reverseProxy) {
		const forwarded = String(socket.handshake.headers["x-forwarded-for"])
			.split(/\s*,\s*/)
			.filter(Boolean);

		if (forwarded.length && net.isIP(forwarded[0])) {
			ip = forwarded[0];
		}
	}

	return ip.replace(/^::ffff:/, "");
}

function getClientSecure(socket: Socket) {
	let secure = socket.handshake.secure;

	if (Config.values.reverseProxy && socket.handshake.headers["x-forwarded-proto"] === "https") {
		secure = true;
	}

	return secure;
}

function getClientConfiguration(
	manager: ClientManager
): SharedConfiguration | LockedSharedConfiguration {
	const common = {
		fileUpload: Config.values.fileUpload.enable,
		ldapEnabled: Config.values.ldap.enable,
		isUpdateAvailable: changelog.isUpdateAvailable,
		applicationServerKey: manager.webPush.vapidKeys!.publicKey,
		version: Helper.getVersionNumber(),
		gitCommit: Helper.getGitCommit(),
		themes: themes.getAll(),
		defaultTheme: Config.values.theme,
		public: Config.values.public,
		useHexIp: Config.values.useHexIp,
		prefetch: Config.values.prefetch,
		fileUploadMaxFileSize: Uploader ? Uploader.getMaxFileSize() : undefined, // TODO can't be undefined?
	};

	const defaultsOverride = {
		nick: Config.getDefaultNick(), // expand the number part

		// TODO: this doesn't seem right, if the client needs this as a buffer
		// the client ought to add it on its own
		sasl: "",
		saslAccount: "",
		saslPassword: "",
	};

	if (!Config.values.lockNetwork) {
		const defaults: ConfigNetDefaults = {
			..._.clone(Config.values.defaults),
			...defaultsOverride,
		};
		const result: SharedConfiguration = {
			...common,
			defaults: defaults,
			lockNetwork: Config.values.lockNetwork,
		};
		return result;
	}

	// Only send defaults that are visible on the client
	const defaults: LockedConfigNetDefaults = {
		..._.omit(Config.values.defaults, ["host", "name", "port", "tls", "rejectUnauthorized"]),
		...defaultsOverride,
	};

	const result: LockedSharedConfiguration = {
		...common,
		lockNetwork: Config.values.lockNetwork,
		defaults: defaults,
	};

	return result;
}
