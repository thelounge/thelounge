import _ from "lodash";
import UAParser from "ua-parser-js";
import {v4 as uuidv4} from "uuid";
import escapeRegExp from "lodash/escapeRegExp";
import crypto from "crypto";
import colors from "chalk";

import log from "./log";
import Chan, {ChanConfig} from "./models/chan";
import Msg from "./models/msg";
import Config from "./config";
import {condensedTypes} from "../shared/irc";
import {MessageType} from "../shared/types/msg";
import {SharedMention} from "../shared/types/mention";

import inputs from "./plugins/inputs";
import PublicClient from "./plugins/packages/publicClient";
import SqliteMessageStorage from "./plugins/messageStorage/sqlite";
import TextFileMessageStorage from "./plugins/messageStorage/text";
import Network, {IgnoreListItem, NetworkConfig, NetworkWithIrcFramework} from "./models/network";
import ClientManager from "./clientManager";
import {MessageStorage} from "./plugins/messageStorage/types";
import {StorageCleaner} from "./storageCleaner";
import {SearchQuery, SearchResponse} from "../shared/types/storage";
import {SharedChan, ChanType} from "../shared/types/chan";
import {SharedNetwork} from "../shared/types/network";
import {ServerToClientEvents} from "../shared/types/socket-events";

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

class Client {
	awayMessage!: string;
	lastActiveChannel!: number;
	attachedClients!: {
		[socketId: string]: {token: string; openChannel: number};
	};
	config!: UserConfig;
	id: string;
	idMsg!: number;
	idChan!: number;
	name!: string;
	networks!: Network[];
	mentions!: SharedMention[];
	manager!: ClientManager;
	messageStorage!: MessageStorage[];
	highlightRegex!: RegExp | null;
	highlightExceptionRegex!: RegExp | null;
	messageProvider?: SqliteMessageStorage;

	fileHash!: string;

	constructor(manager: ClientManager, name?: string, config = {} as UserConfig) {
		this.id = uuidv4();
		_.merge(this, {
			awayMessage: "",
			lastActiveChannel: -1,
			attachedClients: {},
			config: config,
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

		this.config.log = Boolean(this.config.log);
		this.config.password = String(this.config.password);

		if (!Config.values.public && this.config.log) {
			if (Config.values.messageStorage.includes("sqlite")) {
				this.messageProvider = new SqliteMessageStorage(this.name);

				if (Config.values.storagePolicy.enabled) {
					log.info(
						`Activating storage cleaner. Policy: ${Config.values.storagePolicy.deletionPolicy}. MaxAge: ${Config.values.storagePolicy.maxAgeDays} days`
					);
					const cleaner = new StorageCleaner(this.messageProvider);
					cleaner.start();
				}

				this.messageStorage.push(this.messageProvider);
			}

			if (Config.values.messageStorage.includes("text")) {
				this.messageStorage.push(new TextFileMessageStorage(this.name));
			}

			for (const messageStorage of this.messageStorage) {
				messageStorage.enable().catch((e) => log.error(e));
			}
		}

		if (!_.isPlainObject(this.config.sessions)) {
			this.config.sessions = {};
		}

		if (!_.isPlainObject(this.config.clientSettings)) {
			this.config.clientSettings = {};
		}

		if (!_.isPlainObject(this.config.browser)) {
			this.config.browser = {};
		}

		if (this.config.clientSettings.awayMessage) {
			this.awayMessage = this.config.clientSettings.awayMessage;
		}

		this.config.clientSettings.searchEnabled = this.messageProvider !== undefined;

		this.compileCustomHighlights();

		_.forOwn(this.config.sessions, (session) => {
			if (session.pushSubscription) {
				this.registerPushSubscription(session, session.pushSubscription, true);
			}
		});
	}

	connect() {
		if (this.networks.length !== 0) {
			throw new Error(`${this.name} is already connected`);
		}

		(this.config.networks || []).forEach((network) => this.connectToNetwork(network, true));

		// Networks are stored directly in the client object
		// We don't need to keep it in the config object
		delete this.config.networks;

		if (this.name) {
			log.info(`User ${colors.bold(this.name)} loaded`);

			// Networks are created instantly, but to reduce server load on startup
			// We randomize the IRC connections and channel log loading
			let delay = this.manager.clients.length * 500;
			this.networks.forEach((network) => {
				setTimeout(() => {
					network.channels.forEach((channel) => channel.loadMessages(this, network));

					if (!network.userDisconnected && network.irc) {
						network.irc.connect();
					}
				}, delay);

				delay += 1000 + Math.floor(Math.random() * 1000);
			});

			this.fileHash = this.manager.getDataToSave(this).newHash;
		}
	}

	createChannel(attr: Partial<Chan>) {
		const chan = new Chan(attr);
		chan.id = this.idChan++;

		return chan;
	}

	emit<Ev extends keyof ServerToClientEvents>(
		event: Ev,
		...args: Parameters<ServerToClientEvents[Ev]>
	) {
		if (this.manager !== null) {
			this.manager.sockets.in(this.id).emit(event, ...args);
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
					this.createChannel({
						name: chan.name,
						key: chan.key || "",
						type: type,
						muted: chan.muted,
					})
				);
			});

			if (badChanConf && this.name) {
				log.warn(
					"User '" +
						this.name +
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

					return this.createChannel({
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
		// Get channel id for lobby before creating other channels for nicer ids
		const lobbyChannelId = this.idChan++;

		const network = this.networkFromConfig(args);

		// Set network lobby channel id
		network.getLobby().id = lobbyChannelId;

		this.networks.push(network);
		this.emit("network", {
			network: network.getFilteredClone(this.lastActiveChannel, -1),
		});

		if (!network.validate(this)) {
			return;
		}

		(network as NetworkWithIrcFramework).createIrcFramework(this);

		// TODO
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		events.forEach(async (plugin) => {
			(await import(`./plugins/irc-events/${plugin}`)).default.apply(this, [
				network.irc,
				network,
			]);
		});

		if (network.userDisconnected) {
			network.getLobby().pushMessage(
				this,
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
			this.save();
			network.channels.forEach((channel) => channel.loadMessages(this, network));
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

		this.config.sessions[token] = _.assign(this.config.sessions[token], {
			lastUse: Date.now(),
			ip: ip,
			agent: friendlyAgent,
		});

		this.save();
	}

	setPassword(hash: string, callback: (success: boolean) => void) {
		const oldHash = this.config.password;
		this.config.password = hash;
		this.manager.saveUser(this, (err) => {
			if (err) {
				// If user file fails to write, reset it back
				this.config.password = oldHash;
				return callback(false);
			}

			return callback(true);
		});
	}

	input(data) {
		data.text.split("\n").forEach((line) => {
			data.text = line;
			this.inputLine(data);
		});
	}

	inputLine(data) {
		const target = this.find(data.target);

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

			plugin.input.apply(this, [target.network, target.chan, cmd, args]);
			return;
		}

		const extPlugin = inputs.pluginCommands.get(cmd);

		if (extPlugin) {
			if (!connected && !extPlugin.allowDisconnected) {
				emitFailureDisconnected();
				return;
			}

			extPlugin.input(
				new PublicClient(this, extPlugin.packageInfo),
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
		irc.raw(text);
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
		const target = this.find(data.target);

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
		const target = this.find(data.target);

		if (!target) {
			return;
		}

		target.chan.messages = [];
		target.chan.unread = 0;
		target.chan.highlight = 0;
		target.chan.firstUnread = 0;

		this.emit("history:clear", {
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
			({} as Record<string, (typeof this.attachedClients)[0]>);

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

	sortChannels(netid: SharedNetwork["uuid"], order: SharedChan["id"][]) {
		const network = _.find(this.networks, {uuid: netid});

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
		this.save();
		// Sync order to connected clients
		this.emit("sync_sort:channels", {
			network: network.uuid,
			order: network.channels.map((obj) => obj.id),
		});
	}

	sortNetworks(order: SharedNetwork["uuid"][]) {
		this.networks.sort((a, b) => order.indexOf(a.uuid) - order.indexOf(b.uuid));
		this.save();
		// Sync order to connected clients
		this.emit("sync_sort:networks", {
			order: this.networks.map((obj) => obj.uuid),
		});
	}

	names(data: {target: number}) {
		const target = this.find(data.target);

		if (!target) {
			return;
		}

		this.emit("names", {
			id: target.chan.id,
			users: target.chan.getSortedUsers(target.network.irc),
		});
	}

	part(network: Network, chan: Chan) {
		network.channels = _.without(network.channels, chan);
		this.mentions = this.mentions.filter((msg) => !(msg.chanId === chan.id));
		chan.destroy();
		this.save();
		this.emit("part", {
			chan: chan.id,
		});
	}

	quit(signOut?: boolean) {
		const sockets = this.manager.sockets.sockets;
		const room = sockets.adapter.rooms.get(this.id);

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
		if (this.awayMessage && _.size(this.attachedClients) === 0) {
			this.networks.forEach((network) => {
				// Only remove away on client attachment if
				// there is no away message on this network
				if (network.irc && !network.awayMessage) {
					network.irc.raw("AWAY");
				}
			});
		}

		const openChannel = this.lastActiveChannel;
		this.attachedClients[socketId] = {token, openChannel};
	}

	clientDetach(socketId: string) {
		delete this.attachedClients[socketId];

		if (this.awayMessage && _.size(this.attachedClients) === 0) {
			this.networks.forEach((network) => {
				// Only set away on client deattachment if
				// there is no away message on this network
				if (network.irc && !network.awayMessage) {
					network.irc.raw("AWAY", this.awayMessage);
				}
			});
		}
	}

	// TODO: type session to this.attachedClients
	registerPushSubscription(session: any, subscription: PushSubscriptionJSON, noSave = false) {
		if (
			!_.isPlainObject(subscription) ||
			typeof subscription.endpoint !== "string" ||
			!/^https?:\/\//.test(subscription.endpoint) ||
			!_.isPlainObject(subscription.keys) ||
			!subscription.keys || // TS compiler doesn't understand isPlainObject
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

			this.manager.saveUser(this);
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
