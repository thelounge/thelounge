"use strict";

const _ = require("lodash");
const log = require("./log");
const colors = require("chalk");
const Chan = require("./models/chan");
const crypto = require("crypto");
const Msg = require("./models/msg");
const Network = require("./models/network");
const Helper = require("./helper");
const UAParser = require("ua-parser-js");
const uuidv4 = require("uuid/v4");

const MessageStorage = require("./plugins/messageStorage/sqlite");
const TextFileMessageStorage = require("./plugins/messageStorage/text");

module.exports = Client;

const events = [
	"away",
	"connection",
	"unhandled",
	"banlist",
	"ctcp",
	"chghost",
	"error",
	"invite",
	"join",
	"kick",
	"mode",
	"motd",
	"message",
	"names",
	"nick",
	"part",
	"quit",
	"topic",
	"welcome",
	"list",
	"whois",
];
const inputs = [
	"ban",
	"ctcp",
	"msg",
	"part",
	"rejoin",
	"action",
	"away",
	"connect",
	"disconnect",
	"ignore",
	"invite",
	"kick",
	"mode",
	"nick",
	"notice",
	"query",
	"quit",
	"raw",
	"topic",
	"list",
	"whois",
].reduce(function(plugins, name) {
	const plugin = require(`./plugins/inputs/${name}`);
	plugin.commands.forEach((command) => plugins[command] = plugin);
	return plugins;
}, {});

function Client(manager, name, config = {}) {
	_.merge(this, {
		awayMessage: config.awayMessage || "",
		lastActiveChannel: -1,
		attachedClients: {},
		config: config,
		id: uuidv4(),
		idChan: 1,
		idMsg: 1,
		name: name,
		networks: [],
		sockets: manager.sockets,
		manager: manager,
		messageStorage: [],
	});

	const client = this;
	let delay = 0;

	if (!Helper.config.public && client.config.log) {
		if (Helper.config.messageStorage.includes("sqlite")) {
			client.messageStorage.push(new MessageStorage(client));
		}

		if (Helper.config.messageStorage.includes("text")) {
			client.messageStorage.push(new TextFileMessageStorage(client));
		}

		for (const messageStorage of client.messageStorage) {
			messageStorage.enable();
		}
	}

	(client.config.networks || []).forEach((n) => {
		setTimeout(function() {
			client.connect(n);
		}, delay);
		delay += 1000;
	});

	if (typeof client.config.sessions !== "object") {
		client.config.sessions = {};
	}

	_.forOwn(client.config.sessions, (session) => {
		if (session.pushSubscription) {
			this.registerPushSubscription(session, session.pushSubscription, true);
		}
	});

	if (client.name) {
		log.info(`User ${colors.bold(client.name)} loaded`);
	}
}

Client.prototype.createChannel = function(attr) {
	const chan = new Chan(attr);
	chan.id = this.idChan++;

	return chan;
};

Client.prototype.emit = function(event, data) {
	if (this.sockets !== null) {
		this.sockets.in(this.id).emit(event, data);
	}
};

Client.prototype.find = function(channelId) {
	let network = null;
	let chan = null;

	for (const i in this.networks) {
		const n = this.networks[i];
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
};

Client.prototype.connect = function(args) {
	const client = this;
	let channels = [];

	// Get channel id for lobby before creating other channels for nicer ids
	const lobbyChannelId = client.idChan++;

	if (args.channels) {
		let badName = false;

		args.channels.forEach((chan) => {
			if (!chan.name) {
				badName = true;
				return;
			}

			channels.push(client.createChannel({
				name: chan.name,
				key: chan.key || "",
				type: chan.type,
			}));
		});

		if (badName && client.name) {
			log.warn("User '" + client.name + "' on network '" + args.name + "' has an invalid channel which has been ignored");
		}
	// `join` is kept for backwards compatibility when updating from versions <2.0
	// also used by the "connect" window
	} else if (args.join) {
		channels = args.join
			.replace(/,/g, " ")
			.split(/\s+/g)
			.map((chan) => {
				if (!chan.match(/^[#&!+]/)) {
					chan = `#${chan}`;
				}

				return client.createChannel({
					name: chan,
				});
			});
	}

	const network = new Network({
		uuid: args.uuid,
		name: String(args.name || (Helper.config.displayNetwork ? "" : Helper.config.defaults.name) || ""),
		host: String(args.host || ""),
		port: parseInt(args.port, 10),
		tls: !!args.tls,
		userDisconnected: !!args.userDisconnected,
		rejectUnauthorized: !!args.rejectUnauthorized,
		password: String(args.password || ""),
		nick: String(args.nick || ""),
		username: String(args.username || ""),
		realname: String(args.realname || ""),
		commands: args.commands || [],
		ip: args.ip || (client.config && client.config.ip) || client.ip,
		hostname: args.hostname || (client.config && client.config.hostname) || client.hostname,
		channels: channels,
		ignoreList: args.ignoreList ? args.ignoreList : [],
	});

	// Set network lobby channel id
	network.channels[0].id = lobbyChannelId;

	client.networks.push(network);
	client.emit("network", {
		networks: [network.getFilteredClone(this.lastActiveChannel, -1)],
	});

	if (!network.validate(client)) {
		return;
	}

	network.createIrcFramework(client);

	events.forEach((plugin) => {
		require(`./plugins/irc-events/${plugin}`).apply(client, [
			network.irc,
			network,
		]);
	});

	if (network.userDisconnected) {
		network.channels[0].pushMessage(client, new Msg({
			text: "You have manually disconnected from this network before, use /connect command to connect again.",
		}), true);
	} else {
		network.irc.connect();
	}

	client.save();

	channels.forEach((channel) => channel.loadMessages(client, network));
};

Client.prototype.generateToken = function(callback) {
	crypto.randomBytes(64, (err, buf) => {
		if (err) {
			throw err;
		}

		callback(buf.toString("hex"));
	});
};

Client.prototype.calculateTokenHash = function(token) {
	return crypto.createHash("sha512").update(token).digest("hex");
};

Client.prototype.updateSession = function(token, ip, request) {
	const client = this;
	const agent = UAParser(request.headers["user-agent"] || "");
	let friendlyAgent = "";

	if (agent.browser.name) {
		friendlyAgent = `${agent.browser.name} ${agent.browser.major}`;
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

	client.manager.updateUser(client.name, {
		sessions: client.config.sessions,
	});
};

Client.prototype.setPassword = function(hash, callback) {
	const client = this;

	client.manager.updateUser(client.name, {
		password: hash,
	}, function(err) {
		if (err) {
			return callback(false);
		}

		client.config.password = hash;
		return callback(true);
	});
};

Client.prototype.input = function(data) {
	const client = this;
	data.text.split("\n").forEach((line) => {
		data.text = line;
		client.inputLine(data);
	});
};

Client.prototype.inputLine = function(data) {
	const client = this;
	const target = client.find(data.target);

	if (!target) {
		return;
	}

	// Sending a message to a channel is higher priority than merely opening one
	// so that reloading the page will open this channel
	this.lastActiveChannel = target.chan.id;

	let text = data.text;

	// This is either a normal message or a command escaped with a leading '/'
	if (text.charAt(0) !== "/" || text.charAt(1) === "/") {
		if (target.chan.type === Chan.Type.LOBBY) {
			target.chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "Messages can not be sent to lobbies.",
			}));
			return;
		}

		text = "say " + text.replace(/^\//, "");
	} else {
		text = text.substr(1);
	}

	const args = text.split(" ");
	const cmd = args.shift().toLowerCase();

	const irc = target.network.irc;
	let connected = irc && irc.connection && irc.connection.connected;

	if (inputs.hasOwnProperty(cmd) && typeof inputs[cmd].input === "function") {
		const plugin = inputs[cmd];

		if (connected || plugin.allowDisconnected) {
			connected = true;
			plugin.input.apply(client, [target.network, target.chan, cmd, args]);
		}
	} else if (connected) {
		irc.raw(text);
	}

	if (!connected) {
		target.chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: "You are not connected to the IRC network, unable to send your command.",
		}));
	}
};

Client.prototype.more = function(data) {
	const client = this;
	const target = client.find(data.target);

	if (!target) {
		return null;
	}

	const chan = target.chan;
	let messages = [];
	let index = 0;

	// If client requests -1, send last 100 messages
	if (data.lastId < 0) {
		index = chan.messages.length;
	} else {
		index = chan.messages.findIndex((val) => val.id === data.lastId);
	}

	// If requested id is not found, an empty array will be sent
	if (index > 0) {
		messages = chan.messages.slice(Math.max(0, index - 100), index);
	}

	return {
		chan: chan.id,
		messages: messages,
		moreHistoryAvailable: index > 100,
	};
};

Client.prototype.open = function(socketId, target) {
	// Due to how socket.io works internally, normal events may arrive later than
	// the disconnect event, and because we can't control this timing precisely,
	// process this event normally even if there is no attached client anymore.
	const attachedClient = this.attachedClients[socketId] || {};

	// Opening a window like settings
	if (target === null) {
		attachedClient.openChannel = -1;
		return;
	}

	target = this.find(target);

	if (!target) {
		return;
	}

	target.chan.unread = 0;
	target.chan.highlight = 0;

	if (target.chan.messages.length > 0) {
		target.chan.firstUnread = target.chan.messages[target.chan.messages.length - 1].id;
	}

	attachedClient.openChannel = target.chan.id;
	this.lastActiveChannel = target.chan.id;

	this.emit("open", target.chan.id);
};

Client.prototype.sort = function(data) {
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
			if (a.type === Chan.Type.LOBBY) {
				return -1;
			} else if (b.type === Chan.Type.LOBBY) {
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
};

Client.prototype.names = function(data) {
	const client = this;
	const target = client.find(data.target);

	if (!target) {
		return;
	}

	client.emit("names", {
		id: target.chan.id,
		users: target.chan.getSortedUsers(target.network.irc),
	});
};

Client.prototype.quit = function(signOut) {
	const sockets = this.sockets.sockets;
	const room = sockets.adapter.rooms[this.id];

	if (room && room.sockets) {
		for (const user in room.sockets) {
			const socket = sockets.connected[user];

			if (socket) {
				if (signOut) {
					socket.emit("sign-out");
				}

				socket.disconnect();
			}
		}
	}

	this.networks.forEach((network) => {
		if (network.irc) {
			network.irc.quit(Helper.config.leaveMessage);
		}

		network.destroy();
	});

	for (const messageStorage of this.messageStorage) {
		messageStorage.close();
	}
};

Client.prototype.clientAttach = function(socketId, token) {
	const client = this;
	let save = false;

	if (client.awayMessage && _.size(client.attachedClients) === 0) {
		client.networks.forEach(function(network) {
			// Only remove away on client attachment if
			// there is no away message on this network
			if (network.irc && !network.awayMessage) {
				network.irc.raw("AWAY");
			}
		});
	}

	const openChannel = client.lastActiveChannel;
	client.attachedClients[socketId] = {token, openChannel};

	// Update old networks to store ip and hostmask
	client.networks.forEach((network) => {
		if (!network.ip) {
			save = true;
			network.ip = (client.config && client.config.ip) || client.ip;
		}

		if (!network.hostname) {
			const hostmask = (client.config && client.config.hostname) || client.hostname;

			if (hostmask) {
				save = true;
				network.hostmask = hostmask;
			}
		}
	});

	if (save) {
		client.save();
	}
};

Client.prototype.clientDetach = function(socketId) {
	const client = this;

	delete this.attachedClients[socketId];

	if (client.awayMessage && _.size(client.attachedClients) === 0) {
		client.networks.forEach(function(network) {
			// Only set away on client deattachment if
			// there is no away message on this network
			if (network.irc && !network.awayMessage) {
				network.irc.raw("AWAY", client.awayMessage);
			}
		});
	}
};

Client.prototype.registerPushSubscription = function(session, subscription, noSave) {
	if (!_.isPlainObject(subscription) || !_.isPlainObject(subscription.keys)
	|| typeof subscription.endpoint !== "string" || !/^https?:\/\//.test(subscription.endpoint)
	|| typeof subscription.keys.p256dh !== "string" || typeof subscription.keys.auth !== "string") {
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
		this.manager.updateUser(this.name, {
			sessions: this.config.sessions,
		});
	}

	return data;
};

Client.prototype.unregisterPushSubscription = function(token) {
	this.config.sessions[token].pushSubscription = null;
	this.manager.updateUser(this.name, {
		sessions: this.config.sessions,
	});
};

Client.prototype.save = _.debounce(function SaveClient() {
	if (Helper.config.public) {
		return;
	}

	const client = this;
	const json = {};
	json.networks = this.networks.map((n) => n.export());
	client.manager.updateUser(client.name, json);
}, 1000, {maxWait: 10000});
