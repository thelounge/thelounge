import _ from "lodash";
import UAParser from "ua-parser-js";
import {v4 as uuidv4} from "uuid";
import escapeRegExp from "lodash/escapeRegExp";
import crypto from "crypto";
import colors from "chalk";

import log from "./log";
import Chan, {ChanConfig, Channel, ChanType} from "./models/chan";
import Msg, {MessageType, UserInMessage} from "./models/msg";
import Config from "./config";
import {condensedTypes} from "../shared/irc";

import inputs from "./plugins/inputs";
import PublicClient from "./plugins/packages/publicClient";
import SqliteMessageStorage from "./plugins/messageStorage/sqlite";
import TextFileMessageStorage from "./plugins/messageStorage/text";
import Network, {IgnoreListItem, NetworkConfig, NetworkWithIrcFramework} from "./models/network";
import ClientManager from "./clientManager";
import {MessageStorage, SearchQuery, SearchResponse} from "./plugins/messageStorage/types";

type OrderItem = Chan["id"] | Network["uuid"];
type Order = OrderItem[];

const events = [
	"away",
	"cap",
	"connection",
	"unhandled",
	"ctcp",
	"chghost",
	"error",
	"help",
	"info",
	"invite",
	"join",
	"kick",
	"list",
	"mode",
	"modelist",
	"motd",
	"message",
	"names",
	"nick",
	"part",
	"quit",
	"sasl",
	"topic",
	"welcome",
	"whois",
];

type ClientPushSubscription = {
	endpoint: string;
	keys: {
		p256dh: string;
		auth: string;
	};
};

export type UserConfig = {
	log: boolean;
	password: string;
	sessions: {
		[token: string]: {
			lastUse: number;
			ip: string;
			agent: string;
			pushSubscription?: ClientPushSubscription;
		};
	};
	clientSettings: {
		[key: string]: any;
	};
	browser?: {
		language?: string;
		ip?: string;
		hostname?: string;
		isSecure?: boolean;
	};
	networks?: NetworkConfig[];
};

export type Mention = {
	chanId: number;
	msgId: number;
	type: MessageType;
	time: Date;
	text: string;
	from: UserInMessage;
};

class Client {
	awayMessage!: string;
	lastActiveChannel!: number;
	attachedClients!: {
		[socketId: string]: {token: string; openChannel: number};
	};
	config!: UserConfig;
	id!: number;
	idMsg!: number;
	idChan!: number;
	name!: string;
	networks!: Network[];
	mentions!: Mention[];
	manager!: ClientManager;
	messageStorage!: MessageStorage[];
	highlightRegex!: RegExp | null;
	highlightExceptionRegex!: RegExp | null;
	messageProvider?: SqliteMessageStorage;

	fileHash!: string;

	constructor(manager: ClientManager, name?: string, config = {} as UserConfig) {
		_.merge(this, {
			awayMessage: "",
			lastActiveChannel: -1,
			attachedClients: {},
			config: config,
			id: uuidv4(),
			idChan: 1,
			idMsg: 1,
			name: name,
			networks: [],
			mentions: [],
			manager: manager,
			messageStorage: [],
			highlightRegex: null,
			highlightExceptionRegex: null,
			messageProvider: undefined,
		});

		const client = this;

		client.config.log = Boolean(client.config.log);
		client.config.password = String(client.config.password);

		if (!Config.values.public && client.config.log) {
			if (Config.values.messageStorage.includes("sqlite")) {
				client.messageProvider = new SqliteMessageStorage(client.name);
				client.messageStorage.push(client.messageProvider);
			}

			if (Config.values.messageStorage.includes("text")) {
				client.messageStorage.push(new TextFileMessageStorage(client.name));
			}

			for (const messageStorage of client.messageStorage) {
				messageStorage.enable().catch((e) => log.error(e));
			}
		}

		if (!_.isPlainObject(client.config.sessions)) {
			client.config.sessions = {};
		}

		if (!_.isPlainObject(client.config.clientSettings)) {
			client.config.clientSettings = {};
		}

		if (!_.isPlainObject(client.config.browser)) {
			client.config.browser = {};
		}

		if (client.config.clientSettings.awayMessage) {
			client.awayMessage = client.config.clientSettings.awayMessage;
		}

		client.config.clientSettings.searchEnabled = client.messageProvider !== undefined;

		client.compileCustomHighlights();

		_.forOwn(client.config.sessions, (session) => {
			if (session.pushSubscription) {
				this.registerPushSubscription(session, session.pushSubscription, true);
			}
		});
	}

	connect() {
		const client = this;

		if (client.networks.length !== 0) {
			throw new Error(`${client.name} is already connected`);
		}

		(client.config.networks || []).forEach((network) => client.connectToNetwork(network, true));

		// Networks are stored directly in the client object
		// We don't need to keep it in the config object
		delete client.config.networks;

		if (client.name) {
			log.info(`User ${colors.bold(client.name)} loaded`);

			// Networks are created instantly, but to reduce server load on startup
			// We randomize the IRC connections and channel log loading
			let delay = client.manager.clients.length * 500;
			client.networks.forEach((network) => {
				setTimeout(() => {
					network.channels.forEach((channel) => channel.loadMessages(client, network));

					if (!network.userDisconnected && network.irc) {
						network.irc.connect();
					}
				}, delay);

				delay += 1000 + Math.floor(Math.random() * 1000);
			});

			client.fileHash = client.manager.getDataToSave(client).newHash;
		}
	}

	createChannel(attr: Partial<Chan>) {
		const chan = new Chan(attr);
		chan.id = this.idChan++;

		return chan;
	}

	emit(event: string, data?: any) {
		if (this.manager !== null) {
			this.manager.sockets.in(this.id.toString()).emit(event, data);
		}
	}

	find(channelId: number) {
		let network: Network | null = null;
		let chan: Chan | null | undefined = null;

		for (const n of this.networks) {
			chan = _.find(n.channels, {id: channelId});

			if (chan) {
				network = n;
				break;
			}
		}

		if (network && chan) {
			return {network, chan};
		}

		return false;
	}

	networkFromConfig(args: Record<string, any>): Network {
		const client = this;

		let channels: Chan[] = [];

		if (Array.isArray(args.channels)) {
			let badChanConf = false;

			args.channels.forEach((chan: ChanConfig) => {
				const type = ChanType[(chan.type || "channel").toUpperCase()];

				if (!chan.name || !type) {
					badChanConf = true;
					return;
				}

				channels.push(
					client.createChannel({
						name: chan.name,
						key: chan.key || "",
						type: type,
						muted: chan.muted,
					})
				);
			});

			if (badChanConf && client.name) {
				log.warn(
					"User '" +
						client.name +
						"' on network '" +
						String(args.name) +
						"' has an invalid channel which has been ignored"
				);
			}
			// `join` is kept for backwards compatibility when updating from versions <2.0
			// also used by the "connect" window
		} else if (args.join) {
			channels = args.join
				.replace(/,/g, " ")
				.split(/\s+/g)
				.map((chan: string) => {
					if (!chan.match(/^[#&!+]/)) {
						chan = `#${chan}`;
					}

					return client.createChannel({
						name: chan,
					});
				});
		}

		// TODO; better typing for args
		return new Network({
			uuid: args.uuid,
			name: String(
				args.name || (Config.values.lockNetwork ? Config.values.defaults.name : "") || ""
			),
			host: String(args.host || ""),
			port: parseInt(String(args.port), 10),
			tls: !!args.tls,
			userDisconnected: !!args.userDisconnected,
			rejectUnauthorized: !!args.rejectUnauthorized,
			password: String(args.password || ""),
			nick: String(args.nick || ""),
			username: String(args.username || ""),
			realname: String(args.realname || ""),
			leaveMessage: String(args.leaveMessage || ""),
			sasl: String(args.sasl || ""),
			saslAccount: String(args.saslAccount || ""),
			saslPassword: String(args.saslPassword || ""),
			commands: (args.commands as string[]) || [],
			channels: channels,
			ignoreList: args.ignoreList ? (args.ignoreList as IgnoreListItem[]) : [],

			proxyEnabled: !!args.proxyEnabled,
			proxyHost: String(args.proxyHost || ""),
			proxyPort: parseInt(args.proxyPort, 10),
			proxyUsername: String(args.proxyUsername || ""),
			proxyPassword: String(args.proxyPassword || ""),
		});
	}

	connectToNetwork(args: Record<string, any>, isStartup = false) {
		const client = this;

		// Get channel id for lobby before creating other channels for nicer ids
		const lobbyChannelId = client.idChan++;

		const network = this.networkFromConfig(args);

		// Set network lobby channel id
		network.getLobby().id = lobbyChannelId;

		client.networks.push(network);
		client.emit("network", {
			networks: [network.getFilteredClone(this.lastActiveChannel, -1)],
		});

		if (!network.validate(client)) {
			return;
		}

		(network as NetworkWithIrcFramework).createIrcFramework(client);

		// TODO
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		events.forEach(async (plugin) => {
			(await import(`./plugins/irc-events/${plugin}`)).default.apply(client, [
				network.irc,
				network,
			]);
		});

		if (network.userDisconnected) {
			network.getLobby().pushMessage(
				client,
				new Msg({
					text: "You have manually disconnected from this network before, use the /connect command to connect again.",
				}),
				true
			);
		} else if (!isStartup) {
			// irc is created in createIrcFramework
			// TODO; fix type
			network.irc!.connect();
		}

		if (!isStartup) {
			client.save();
			network.channels.forEach((channel) => channel.loadMessages(client, network));
		}
	}

	generateToken(callback: (token: string) => void) {
		crypto.randomBytes(64, (err, buf) => {
			if (err) {
				throw err;
			}

			callback(buf.toString("hex"));
		});
	}

	calculateTokenHash(token: string) {
		return crypto.createHash("sha512").update(token).digest("hex");
	}

	updateSession(token: string, ip: string, request: any) {
		const client = this;
		const agent = UAParser(request.headers["user-agent"] || "");
		let friendlyAgent = "";

		if (agent.browser.name) {
			friendlyAgent = `${agent.browser.name} ${agent.browser.major || ""}`;
		} else {
			friendlyAgent = "Unknown browser";
		}

		if (agent.os.name) {
			friendlyAgent += ` on ${agent.os.name}`;

			if (agent.os.version) {
				friendlyAgent += ` ${agent.os.version}`;
			}
		}

		client.config.sessions[token] = _.assign(client.config.sessions[token], {
			lastUse: Date.now(),
			ip: ip,
			agent: friendlyAgent,
		});

		client.save();
	}

	setPassword(hash: string, callback: (success: boolean) => void) {
		const client = this;

		const oldHash = client.config.password;
		client.config.password = hash;
		client.manager.saveUser(client, function (err) {
			if (err) {
				// If user file fails to write, reset it back
				client.config.password = oldHash;
				return callback(false);
			}

			return callback(true);
		});
	}

	input(data) {
		const client = this;
		data.text.split("\n").forEach((line) => {
			data.text = line;
			client.inputLine(data);
		});
	}

	inputLine(data) {
		const client = this;
		const target = client.find(data.target);

		if (!target) {
			return;
		}

		// Sending a message to a channel is higher priority than merely opening one
		// so that reloading the page will open this channel
		this.lastActiveChannel = target.chan.id;

		let text: string = data.text;

		// This is either a normal message or a command escaped with a leading '/'
		if (text.charAt(0) !== "/" || text.charAt(1) === "/") {
			if (target.chan.type === ChanType.LOBBY) {
				target.chan.pushMessage(
					this,
					new Msg({
						type: MessageType.ERROR,
						text: "Messages can not be sent to lobbies.",
					})
				);
				return;
			}

			text = "say " + text.replace(/^\//, "");
		} else {
			text = text.substring(1);
		}

		const args = text.split(" ");
		const cmd = args?.shift()?.toLowerCase() || "";

		const irc = target.network.irc;
		const connected = irc?.connected;

		const emitFailureDisconnected = () => {
			target.chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: "You are not connected to the IRC network, unable to send your command.",
				})
			);
		};

		const plugin = inputs.userInputs.get(cmd);

		if (plugin) {
			if (!connected && !plugin.allowDisconnected) {
				emitFailureDisconnected();
				return;
			}

			plugin.input.apply(client, [target.network, target.chan, cmd, args]);
			return;
		}

		const extPlugin = inputs.pluginCommands.get(cmd);

		if (extPlugin) {
			if (!connected && !extPlugin.allowDisconnected) {
				emitFailureDisconnected();
				return;
			}

			extPlugin.input(
				new PublicClient(client, extPlugin.packageInfo),
				{network: target.network, chan: target.chan},
				cmd,
				args
			);
			return;
		}

		if (!connected) {
			emitFailureDisconnected();
			return;
		}

		// TODO: fix
		irc!.raw(text);
	}

	compileCustomHighlights() {
		function compileHighlightRegex(customHighlightString: string) {
			if (typeof customHighlightString !== "string") {
				return null;
			}

			// Ensure we don't have empty strings in the list of highlights
			const highlightsTokens = customHighlightString
				.split(",")
				.map((highlight) => escapeRegExp(highlight.trim()))
				.filter((highlight) => highlight.length > 0);

			if (highlightsTokens.length === 0) {
				return null;
			}

			return new RegExp(
				`(?:^|[ .,+!?|/:<>(){}'"@&~-])(?:${highlightsTokens.join(
					"|"
				)})(?:$|[ .,+!?|/:<>(){}'"-])`,
				"i"
			);
		}

		this.highlightRegex = compileHighlightRegex(this.config.clientSettings.highlights);
		this.highlightExceptionRegex = compileHighlightRegex(
			this.config.clientSettings.highlightExceptions
		);
	}

	more(data) {
		const client = this;
		const target = client.find(data.target);

		if (!target) {
			return null;
		}

		const chan = target.chan;
		let messages: Msg[] = [];
		let index = 0;

		// If client requests -1, send last 100 messages
		if (data.lastId < 0) {
			index = chan.messages.length;
		} else {
			index = chan.messages.findIndex((val) => val.id === data.lastId);
		}

		// If requested id is not found, an empty array will be sent
		if (index > 0) {
			let startIndex = index;

			if (data.condensed) {
				// Limit to 1000 messages (that's 10x normal limit)
				const indexToStop = Math.max(0, index - 1000);
				let realMessagesLeft = 100;

				for (let i = index - 1; i >= indexToStop; i--) {
					startIndex--;

					// Do not count condensed messages towards the 100 messages
					if (condensedTypes.has(chan.messages[i].type)) {
						continue;
					}

					// Count up actual 100 visible messages
					if (--realMessagesLeft === 0) {
						break;
					}
				}
			} else {
				startIndex = Math.max(0, index - 100);
			}

			messages = chan.messages.slice(startIndex, index);
		}

		return {
			chan: chan.id,
			messages: messages,
			totalMessages: chan.messages.length,
		};
	}

	clearHistory(data) {
		const client = this;
		const target = client.find(data.target);

		if (!target) {
			return;
		}

		target.chan.messages = [];
		target.chan.unread = 0;
		target.chan.highlight = 0;
		target.chan.firstUnread = 0;

		client.emit("history:clear", {
			target: target.chan.id,
		});

		if (!target.chan.isLoggable()) {
			return;
		}

		for (const messageStorage of this.messageStorage) {
			messageStorage.deleteChannel(target.network, target.chan).catch((e) => log.error(e));
		}
	}

	async search(query: SearchQuery): Promise<SearchResponse> {
		if (!this.messageProvider?.isEnabled) {
			return {
				...query,
				results: [],
			};
		}

		return this.messageProvider.search(query);
	}

	open(socketId: string, target: number) {
		// Due to how socket.io works internally, normal events may arrive later than
		// the disconnect event, and because we can't control this timing precisely,
		// process this event normally even if there is no attached client anymore.
		const attachedClient =
			this.attachedClients[socketId] ||
			({} as Record<string, typeof this.attachedClients[0]>);

		// Opening a window like settings
		if (target === null) {
			attachedClient.openChannel = -1;
			return;
		}

		const targetNetChan = this.find(target);

		if (!targetNetChan) {
			return;
		}

		targetNetChan.chan.unread = 0;
		targetNetChan.chan.highlight = 0;

		if (targetNetChan.chan.messages.length > 0) {
			targetNetChan.chan.firstUnread =
				targetNetChan.chan.messages[targetNetChan.chan.messages.length - 1].id;
		}

		attachedClient.openChannel = targetNetChan.chan.id;
		this.lastActiveChannel = targetNetChan.chan.id;

		this.emit("open", targetNetChan.chan.id);
	}

	sort(data: {order: Order; type: "networks" | "channels"; target: string}) {
		const order = data.order;

		if (!_.isArray(order)) {
			return;
		}

		switch (data.type) {
			case "networks":
				this.networks.sort((a, b) => order.indexOf(a.uuid) - order.indexOf(b.uuid));

				// Sync order to connected clients
				this.emit("sync_sort", {
					order: this.networks.map((obj) => obj.uuid),
					type: data.type,
				});

				break;

			case "channels": {
				const network = _.find(this.networks, {uuid: data.target});

				if (!network) {
					return;
				}

				network.channels.sort((a, b) => {
					// Always sort lobby to the top regardless of what the client has sent
					// Because there's a lot of code that presumes channels[0] is the lobby
					if (a.type === ChanType.LOBBY) {
						return -1;
					} else if (b.type === ChanType.LOBBY) {
						return 1;
					}

					return order.indexOf(a.id) - order.indexOf(b.id);
				});

				// Sync order to connected clients
				this.emit("sync_sort", {
					order: network.channels.map((obj) => obj.id),
					type: data.type,
					target: network.uuid,
				});

				break;
			}
		}

		this.save();
	}

	names(data: {target: number}) {
		const client = this;
		const target = client.find(data.target);

		if (!target) {
			return;
		}

		client.emit("names", {
			id: target.chan.id,
			users: target.chan.getSortedUsers(target.network.irc),
		});
	}

	part(network: Network, chan: Chan) {
		const client = this;
		network.channels = _.without(network.channels, chan);
		client.mentions = client.mentions.filter((msg) => !(msg.chanId === chan.id));
		chan.destroy();
		client.save();
		client.emit("part", {
			chan: chan.id,
		});
	}

	quit(signOut?: boolean) {
		const sockets = this.manager.sockets.sockets;
		const room = sockets.adapter.rooms.get(this.id.toString());

		if (room) {
			for (const user of room) {
				const socket = sockets.sockets.get(user);

				if (socket) {
					if (signOut) {
						socket.emit("sign-out");
					}

					socket.disconnect();
				}
			}
		}

		this.networks.forEach((network) => {
			network.quit();
			network.destroy();
		});

		for (const messageStorage of this.messageStorage) {
			messageStorage.close().catch((e) => log.error(e));
		}
	}

	clientAttach(socketId: string, token: string) {
		const client = this;

		if (client.awayMessage && _.size(client.attachedClients) === 0) {
			client.networks.forEach(function (network) {
				// Only remove away on client attachment if
				// there is no away message on this network
				if (network.irc && !network.awayMessage) {
					network.irc.raw("AWAY");
				}
			});
		}

		const openChannel = client.lastActiveChannel;
		client.attachedClients[socketId] = {token, openChannel};
	}

	clientDetach(socketId: string) {
		const client = this;

		delete this.attachedClients[socketId];

		if (client.awayMessage && _.size(client.attachedClients) === 0) {
			client.networks.forEach(function (network) {
				// Only set away on client deattachment if
				// there is no away message on this network
				if (network.irc && !network.awayMessage) {
					network.irc.raw("AWAY", client.awayMessage);
				}
			});
		}
	}

	// TODO: type session to this.attachedClients
	registerPushSubscription(session: any, subscription: ClientPushSubscription, noSave = false) {
		if (
			!_.isPlainObject(subscription) ||
			!_.isPlainObject(subscription.keys) ||
			typeof subscription.endpoint !== "string" ||
			!/^https?:\/\//.test(subscription.endpoint) ||
			typeof subscription.keys.p256dh !== "string" ||
			typeof subscription.keys.auth !== "string"
		) {
			session.pushSubscription = null;
			return;
		}

		const data = {
			endpoint: subscription.endpoint,
			keys: {
				p256dh: subscription.keys.p256dh,
				auth: subscription.keys.auth,
			},
		};

		session.pushSubscription = data;

		if (!noSave) {
			this.save();
		}

		return data;
	}

	unregisterPushSubscription(token: string) {
		this.config.sessions[token].pushSubscription = undefined;
		this.save();
	}

	save = _.debounce(
		function SaveClient(this: Client) {
			if (Config.values.public) {
				return;
			}

			const client = this;
			client.manager.saveUser(client);
		},
		5000,
		{maxWait: 20000}
	);
}

export default Client;

// TODO: this should exist elsewhere?
export type IrcEventHandler = (
	this: Client,
	irc: NetworkWithIrcFramework["irc"],
	network: NetworkWithIrcFramework
) => void;
