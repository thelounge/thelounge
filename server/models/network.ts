import _ from "lodash";
import {v4 as uuidv4} from "uuid";
import IrcFramework, {Client as IRCClient} from "irc-framework";
import Chan, {ChanConfig, Channel, ChanType} from "./chan";
import Msg, {MessageType} from "./msg";
import Prefix from "./prefix";
import Helper, {Hostmask} from "../helper";
import Config, {WebIRC} from "../config";
import STSPolicies from "../plugins/sts";
import ClientCertificate, {ClientCertificateType} from "../plugins/clientCertificate";
import Client from "../client";

/**
 * List of keys which should be sent to the client by default.
 */
const fieldsForClient = {
	uuid: true,
	name: true,
	nick: true,
	serverOptions: true,
};

type NetworkIrcOptions = {
	host: string;
	port: number;
	password: string;
	nick: string;
	username: string;
	gecos: string;
	tls: boolean;
	rejectUnauthorized: boolean;
	webirc: WebIRC | null;
	client_certificate: ClientCertificateType | null;
	socks?: {
		host: string;
		port: number;
		user: string;
		pass: string;
	};
	sasl_mechanism?: string;
	account?:
		| {
				account: string;
				password: string;
		  }
		| Record<string, never>;
};

type NetworkStatus = {
	connected: boolean;
	secure: boolean;
};

export type IgnoreListItem = Hostmask & {
	when?: number;
};

type IgnoreList = IgnoreListItem[];

type NonNullableIRCWithOptions = NonNullable<IRCClient & {options: NetworkIrcOptions}>;

// eslint-disable-next-line no-use-before-define
export type NetworkWithIrcFramework = Network & {
	// eslint-disable-next-line no-use-before-define
	irc: NonNullable<Network["irc"]> & {
		options: NonNullableIRCWithOptions;
	};
};

export type NetworkConfig = {
	nick: string;
	name: string;
	host: string;
	port: number;
	tls: boolean;
	userDisconnected: boolean;
	rejectUnauthorized: boolean;
	password: string;
	awayMessage: string;
	commands: any[];
	username: string;
	realname: string;
	leaveMessage: string;
	sasl: string;
	saslAccount: string;
	saslPassword: string;
	channels: ChanConfig[];
	uuid: string;
	proxyHost: string;
	proxyPort: number;
	proxyUsername: string;
	proxyPassword: string;
	proxyEnabled: boolean;
	highlightRegex?: string;
	ignoreList: any[];
};

class Network {
	nick!: string;
	name!: string;
	host!: string;
	port!: number;
	tls!: boolean;
	userDisconnected!: boolean;
	rejectUnauthorized!: boolean;
	password!: string;
	awayMessage!: string;
	commands!: any[];
	username!: string;
	realname!: string;
	leaveMessage!: string;
	sasl!: string;
	saslAccount!: string;
	saslPassword!: string;
	channels!: Chan[];
	uuid!: string;
	proxyHost!: string;
	proxyPort!: number;
	proxyUsername!: string;
	proxyPassword!: string;
	proxyEnabled!: boolean;
	highlightRegex?: RegExp;

	irc?: IrcFramework.Client & {
		options?: NetworkIrcOptions;
	};

	chanCache!: Chan[];
	ignoreList!: IgnoreList;
	keepNick!: string | null;

	status!: NetworkStatus;

	serverOptions!: {
		CHANTYPES: string[];
		PREFIX: Prefix;
		NETWORK: string;
	};

	// TODO: this is only available on export
	hasSTSPolicy!: boolean;

	constructor(attr?: Partial<Network>) {
		_.defaults(this, attr, {
			name: "",
			nick: "",
			host: "",
			port: 6667,
			tls: false,
			userDisconnected: false,
			rejectUnauthorized: false,
			password: "",
			awayMessage: "",
			commands: [],
			username: "",
			realname: "",
			leaveMessage: "",
			sasl: "",
			saslAccount: "",
			saslPassword: "",
			channels: [],
			irc: null,
			serverOptions: {
				CHANTYPES: ["#", "&"],
				PREFIX: new Prefix([
					{symbol: "!", mode: "Y"},
					{symbol: "@", mode: "o"},
					{symbol: "%", mode: "h"},
					{symbol: "+", mode: "v"},
				]),
				NETWORK: "",
			},

			proxyHost: "",
			proxyPort: 1080,
			proxyUsername: "",
			proxyPassword: "",
			proxyEnabled: false,

			chanCache: [],
			ignoreList: [],
			keepNick: null,
		});

		if (!this.uuid) {
			this.uuid = uuidv4();
		}

		if (!this.name) {
			this.name = this.host;
		}

		this.channels.unshift(
			new Chan({
				name: this.name,
				type: ChanType.LOBBY,
				// The lobby only starts as muted if every channel (unless it's special) is muted.
				// This is A) easier to implement and B) stops some confusion on startup.
				muted:
					this.channels.length >= 1 &&
					this.channels.every((chan) => chan.muted || chan.type === ChanType.SPECIAL),
			})
		);
	}

	validate(this: Network, client: Client) {
		// Remove !, :, @ and whitespace characters from nicknames and usernames
		const cleanNick = (str: string) => str.replace(/[\x00\s:!@]/g, "_").substring(0, 100);

		// Remove new lines and limit length
		const cleanString = (str: string) => str.replace(/[\x00\r\n]/g, "").substring(0, 300);

		this.setNick(cleanNick(String(this.nick || Config.getDefaultNick())));

		if (!this.username) {
			// If username is empty, make one from the provided nick
			this.username = this.nick.replace(/[^a-zA-Z0-9]/g, "");
		}

		this.username = cleanString(this.username) || "thelounge";
		this.realname = cleanString(this.realname) || this.nick;
		this.leaveMessage = cleanString(this.leaveMessage);
		this.password = cleanString(this.password);
		this.host = cleanString(this.host).toLowerCase();
		this.name = cleanString(this.name);
		this.saslAccount = cleanString(this.saslAccount);
		this.saslPassword = cleanString(this.saslPassword);

		this.proxyHost = cleanString(this.proxyHost);
		this.proxyPort = this.proxyPort || 1080;
		this.proxyUsername = cleanString(this.proxyUsername);
		this.proxyPassword = cleanString(this.proxyPassword);
		this.proxyEnabled = !!this.proxyEnabled;

		const error = function (network: Network, text: string) {
			network.getLobby().pushMessage(
				client,
				new Msg({
					type: MessageType.ERROR,
					text: text,
				}),
				true
			);
		};

		if (!this.port) {
			this.port = this.tls ? 6697 : 6667;
		}

		if (!["", "plain", "external"].includes(this.sasl)) {
			this.sasl = "";
		}

		if (Config.values.lockNetwork) {
			// This check is needed to prevent invalid user configurations
			if (
				!Config.values.public &&
				this.host &&
				this.host.length > 0 &&
				this.host !== Config.values.defaults.host
			) {
				error(this, `The hostname you specified (${this.host}) is not allowed.`);
				return false;
			}

			if (Config.values.public) {
				this.name = Config.values.defaults.name;
				// Sync lobby channel name
				this.getLobby().name = Config.values.defaults.name;
			}

			this.host = Config.values.defaults.host;
			this.port = Config.values.defaults.port;
			this.tls = Config.values.defaults.tls;
			this.rejectUnauthorized = Config.values.defaults.rejectUnauthorized;
		}

		if (this.host.length === 0) {
			error(this, "You must specify a hostname to connect.");
			return false;
		}

		const stsPolicy = STSPolicies.get(this.host);

		if (stsPolicy && !this.tls) {
			error(
				this,
				`${this.host} has an active strict transport security policy, will connect to port ${stsPolicy.port} over a secure connection.`
			);

			this.port = stsPolicy.port;
			this.tls = true;
			this.rejectUnauthorized = true;
		}

		return true;
	}

	createIrcFramework(this: NetworkWithIrcFramework, client: Client) {
		this.irc = new IrcFramework.Client({
			version: false, // We handle it ourselves
			outgoing_addr: Config.values.bind,
			enable_chghost: true,
			enable_echomessage: true,
			enable_setname: true,
			auto_reconnect: true,

			// Exponential backoff maxes out at 300 seconds after 9 reconnects,
			// it will keep trying for well over an hour (plus the timeouts)
			auto_reconnect_max_retries: 30,

			// TODO: this type should be set after setIrcFrameworkOptions
		}) as NetworkWithIrcFramework["irc"];

		this.setIrcFrameworkOptions(client);

		this.irc.requestCap([
			"znc.in/self-message", // Legacy echo-message for ZNC
			"znc.in/playback", // See http://wiki.znc.in/Playback
		]);
	}

	setIrcFrameworkOptions(this: NetworkWithIrcFramework, client: Client) {
		this.irc.options.host = this.host;
		this.irc.options.port = this.port;
		this.irc.options.password = this.password;
		this.irc.options.nick = this.nick;
		this.irc.options.username = Config.values.useHexIp
			? Helper.ip2hex(client.config.browser!.ip!)
			: this.username;
		this.irc.options.gecos = this.realname;
		this.irc.options.tls = this.tls;
		this.irc.options.rejectUnauthorized = this.rejectUnauthorized;
		this.irc.options.webirc = this.createWebIrc(client);
		this.irc.options.client_certificate = null;

		if (this.proxyEnabled) {
			this.irc.options.socks = {
				host: this.proxyHost,
				port: this.proxyPort,
				user: this.proxyUsername,
				pass: this.proxyPassword,
			};
		} else {
			delete this.irc.options.socks;
		}

		if (!this.sasl) {
			delete this.irc.options.sasl_mechanism;
			delete this.irc.options.account;
		} else if (this.sasl === "external") {
			this.irc.options.sasl_mechanism = "EXTERNAL";
			this.irc.options.account = {};
			this.irc.options.client_certificate = ClientCertificate.get(this.uuid);
		} else if (this.sasl === "plain") {
			delete this.irc.options.sasl_mechanism;
			this.irc.options.account = {
				account: this.saslAccount,
				password: this.saslPassword,
			};
		}
	}

	createWebIrc(client: Client) {
		if (
			!Config.values.webirc ||
			!Object.prototype.hasOwnProperty.call(Config.values.webirc, this.host)
		) {
			return null;
		}

		const webircObject = {
			password: Config.values.webirc[this.host],
			username: "thelounge",
			address: client.config.browser?.ip,
			hostname: client.config.browser?.hostname,
			options: {},
		};

		// https://ircv3.net/specs/extensions/webirc#options
		if (client.config.browser?.isSecure) {
			webircObject.options = {
				secure: true,
			};
		}

		if (typeof Config.values.webirc[this.host] === "function") {
			webircObject.password = null;

			return Config.values.webirc[this.host](webircObject, this) as typeof webircObject;
		}

		return webircObject;
	}

	edit(this: NetworkWithIrcFramework, client: Client, args: any) {
		const oldNetworkName = this.name;
		const oldNick = this.nick;
		const oldRealname = this.realname;

		this.keepNick = null;
		this.nick = args.nick;
		this.host = String(args.host || "");
		this.name = String(args.name || "") || this.host;
		this.port = parseInt(args.port, 10);
		this.tls = !!args.tls;
		this.rejectUnauthorized = !!args.rejectUnauthorized;
		this.password = String(args.password || "");
		this.username = String(args.username || "");
		this.realname = String(args.realname || "");
		this.leaveMessage = String(args.leaveMessage || "");
		this.sasl = String(args.sasl || "");
		this.saslAccount = String(args.saslAccount || "");
		this.saslPassword = String(args.saslPassword || "");

		this.proxyHost = String(args.proxyHost || "");
		this.proxyPort = parseInt(args.proxyPort, 10);
		this.proxyUsername = String(args.proxyUsername || "");
		this.proxyPassword = String(args.proxyPassword || "");
		this.proxyEnabled = !!args.proxyEnabled;

		// Split commands into an array
		this.commands = String(args.commands || "")
			.replace(/\r\n|\r|\n/g, "\n")
			.split("\n")
			.filter((command) => command.length > 0);

		// Sync lobby channel name
		this.getLobby().name = this.name;

		if (this.name !== oldNetworkName) {
			// Send updated network name to all connected clients
			client.emit("network:name", {
				uuid: this.uuid,
				name: this.name,
			});
		}

		if (!this.validate(client)) {
			return;
		}

		if (this.irc) {
			const connected = this.irc.connection && this.irc.connection.connected;

			if (this.nick !== oldNick) {
				if (connected) {
					// Send new nick straight away
					this.irc.changeNick(this.nick);
				} else {
					this.irc.user.nick = this.nick;

					// Update UI nick straight away if IRC is not connected
					client.emit("nick", {
						network: this.uuid,
						nick: this.nick,
					});
				}
			}

			if (
				connected &&
				this.realname !== oldRealname &&
				this.irc.network.cap.isEnabled("setname")
			) {
				this.irc.raw("SETNAME", this.realname);
			}

			this.setIrcFrameworkOptions(client);

			if (this.irc.options?.username) {
				this.irc.user.username = this.irc.options.username;
			}

			if (this.irc.options?.gecos) {
				this.irc.user.gecos = this.irc.options.gecos;
			}
		}

		client.save();
	}

	destroy() {
		this.channels.forEach((channel) => channel.destroy());
	}

	setNick(this: Network, nick: string) {
		this.nick = nick;
		this.highlightRegex = new RegExp(
			// Do not match characters and numbers (unless IRC color)
			"(?:^|[^a-z0-9]|\x03[0-9]{1,2})" +
				// Escape nickname, as it may contain regex stuff
				_.escapeRegExp(nick) +
				// Do not match characters and numbers
				"(?:[^a-z0-9]|$)",

			// Case insensitive search
			"i"
		);

		if (this.keepNick === nick) {
			this.keepNick = null;
		}

		if (this.irc?.options) {
			this.irc.options.nick = nick;
		}
	}

	getFilteredClone(lastActiveChannel?: number, lastMessage?: number) {
		const filteredNetwork = Object.keys(this).reduce((newNetwork, prop) => {
			if (prop === "channels") {
				// Channels objects perform their own cloning
				newNetwork[prop] = this[prop].map((channel) =>
					channel.getFilteredClone(lastActiveChannel, lastMessage)
				);
			} else if (fieldsForClient[prop]) {
				// Some properties that are not useful for the client are skipped
				newNetwork[prop] = this[prop];
			}

			return newNetwork;
		}, {}) as Network;

		filteredNetwork.status = this.getNetworkStatus();

		return filteredNetwork;
	}

	getNetworkStatus() {
		const status = {
			connected: false,
			secure: false,
		};

		if (this.irc && this.irc.connection && this.irc.connection.transport) {
			const transport = this.irc.connection.transport;

			if (transport.socket) {
				const isLocalhost = transport.socket.remoteAddress === "127.0.0.1";
				const isAuthorized = transport.socket.encrypted && transport.socket.authorized;

				status.connected = transport.isConnected();
				status.secure = isAuthorized || isLocalhost;
			}
		}

		return status;
	}

	addChannel(newChan: Chan) {
		let index = this.channels.length; // Default to putting as the last item in the array

		// Don't sort special channels in amongst channels/users.
		if (newChan.type === ChanType.CHANNEL || newChan.type === ChanType.QUERY) {
			// We start at 1 so we don't test against the lobby
			for (let i = 1; i < this.channels.length; i++) {
				const compareChan = this.channels[i];

				// Negative if the new chan is alphabetically before the next chan in the list, positive if after
				if (
					newChan.name.localeCompare(compareChan.name, undefined, {
						sensitivity: "base",
					}) <= 0 ||
					(compareChan.type !== ChanType.CHANNEL && compareChan.type !== ChanType.QUERY)
				) {
					index = i;
					break;
				}
			}
		}

		this.channels.splice(index, 0, newChan);
		return index;
	}

	quit(quitMessage?: string) {
		if (!this.irc) {
			return;
		}

		// https://ircv3.net/specs/extensions/sts#rescheduling-expiry-on-disconnect
		STSPolicies.refreshExpiration(this.host);

		this.irc.quit(quitMessage || this.leaveMessage || Config.values.leaveMessage);
	}

	exportForEdit() {
		const fieldsToReturn = [
			"uuid",
			"name",
			"nick",
			"password",
			"username",
			"realname",
			"leaveMessage",
			"sasl",
			"saslAccount",
			"saslPassword",
			"commands",

			"proxyEnabled",
			"proxyHost",
			"proxyPort",
			"proxyUsername",
			"proxyPassword",
		];

		if (!Config.values.lockNetwork) {
			fieldsToReturn.push("host");
			fieldsToReturn.push("port");
			fieldsToReturn.push("tls");
			fieldsToReturn.push("rejectUnauthorized");
		}

		const data = _.pick(this, fieldsToReturn) as Network;

		data.hasSTSPolicy = !!STSPolicies.get(this.host);

		return data;
	}

	export() {
		const network = _.pick(this, [
			"uuid",
			"awayMessage",
			"nick",
			"name",
			"host",
			"port",
			"tls",
			"userDisconnected",
			"rejectUnauthorized",
			"password",
			"username",
			"realname",
			"leaveMessage",
			"sasl",
			"saslAccount",
			"saslPassword",
			"commands",
			"ignoreList",

			"proxyHost",
			"proxyPort",
			"proxyUsername",
			"proxyEnabled",
			"proxyPassword",
		]) as Network;

		network.channels = this.channels
			.filter(function (channel) {
				return channel.type === ChanType.CHANNEL || channel.type === ChanType.QUERY;
			})
			.map(function (chan) {
				const keys = ["name", "muted"];

				if (chan.type === ChanType.CHANNEL) {
					keys.push("key");
				} else if (chan.type === ChanType.QUERY) {
					keys.push("type");
				}

				return _.pick(chan, keys);
				// Override the type because we're omitting ID
			}) as Channel[];

		return network;
	}

	getChannel(name: string) {
		name = name.toLowerCase();

		return _.find(this.channels, function (that, i) {
			// Skip network lobby (it's always unshifted into first position)
			return i > 0 && that.name.toLowerCase() === name;
		});
	}

	getLobby() {
		return this.channels[0];
	}
}

export default Network;
