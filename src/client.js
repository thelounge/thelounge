"use strict";

const _ = require("lodash");
const colors = require("chalk");
const pkg = require("../package.json");
const Chan = require("./models/chan");
const crypto = require("crypto");
const Msg = require("./models/msg");
const Network = require("./models/network");
const ircFramework = require("irc-framework");
const Helper = require("./helper");
const UAParser = require("ua-parser-js");
const MessageStorage = require("./plugins/sqlite");

module.exports = Client;

let id = 0;
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
		id: id++,
		name: name,
		networks: [],
		sockets: manager.sockets,
		manager: manager,
	});

	const client = this;
	let delay = 0;

	if (!Helper.config.public) {
		client.messageStorage = new MessageStorage();

		if (client.config.log && Helper.config.messageStorage.includes("sqlite")) {
			client.messageStorage.enable(client.name);
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
	const nick = args.nick || "thelounge";
	let webirc = null;
	let channels = [];

	if (args.channels) {
		let badName = false;

		args.channels.forEach((chan) => {
			if (!chan.name) {
				badName = true;
				return;
			}

			channels.push(new Chan({
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
			.map(function(chan) {
				return new Chan({
					name: chan,
				});
			});
	}

	args.ip = args.ip || (client.config && client.config.ip) || client.ip;
	args.hostname = args.hostname || (client.config && client.config.hostname) || client.hostname;

	const network = new Network({
		uuid: args.uuid,
		name: args.name || (Helper.config.displayNetwork ? "" : Helper.config.defaults.name) || "",
		host: args.host || "",
		port: parseInt(args.port, 10) || (args.tls ? 6697 : 6667),
		tls: !!args.tls,
		rejectUnauthorized: !!args.rejectUnauthorized,
		password: args.password,
		username: args.username || nick.replace(/[^a-zA-Z0-9]/g, ""),
		realname: args.realname || "The Lounge User",
		commands: args.commands,
		ip: args.ip,
		hostname: args.hostname,
		channels: channels,
	});
	network.setNick(nick);

	client.networks.push(network);
	client.emit("network", {
		networks: [network.getFilteredClone(this.lastActiveChannel, -1)],
	});

	if (Helper.config.lockNetwork) {
		// This check is needed to prevent invalid user configurations
		if (!Helper.config.public && args.host && args.host.length > 0 && args.host !== Helper.config.defaults.host) {
			network.channels[0].pushMessage(client, new Msg({
				type: Msg.Type.ERROR,
				text: "Hostname you specified is not allowed.",
			}), true);
			return;
		}

		network.host = Helper.config.defaults.host;
		network.port = Helper.config.defaults.port;
		network.tls = Helper.config.defaults.tls;
		network.rejectUnauthorized = Helper.config.defaults.rejectUnauthorized;
	}

	if (network.host.length === 0) {
		network.channels[0].pushMessage(client, new Msg({
			type: Msg.Type.ERROR,
			text: "You must specify a hostname to connect.",
		}), true);
		return;
	}

	if (Helper.config.webirc && network.host in Helper.config.webirc) {
		if (!args.hostname) {
			args.hostname = args.ip;
		}

		if (args.ip) {
			if (Helper.config.webirc[network.host] instanceof Function) {
				webirc = Helper.config.webirc[network.host](client, args);
			} else {
				webirc = {
					password: Helper.config.webirc[network.host],
					username: pkg.name,
					address: args.ip,
					hostname: args.hostname,
				};
			}
		} else {
			log.warn("Cannot find a valid WEBIRC configuration for " + nick
				+ "!" + network.username + "@" + network.host);
		}
	}

	network.irc = new ircFramework.Client({
		version: false, // We handle it ourselves
		host: network.host,
		port: network.port,
		nick: nick,
		username: Helper.config.useHexIp ? Helper.ip2hex(args.ip) : network.username,
		gecos: network.realname,
		password: network.password,
		tls: network.tls,
		outgoing_addr: Helper.config.bind,
		rejectUnauthorized: network.rejectUnauthorized,
		enable_chghost: true,
		enable_echomessage: true,
		auto_reconnect: true,
		auto_reconnect_wait: 10000 + Math.floor(Math.random() * 1000), // If multiple users are connected to the same network, randomize their reconnections a little
		auto_reconnect_max_retries: 360, // At least one hour (plus timeouts) worth of reconnections
		webirc: webirc,
	});

	network.irc.requestCap([
		"znc.in/self-message", // Legacy echo-message for ZNC
	]);

	// Request only new messages from ZNC if we have sqlite logging enabled
	// See http://wiki.znc.in/Playback
	if (client.config.log && Helper.config.messageStorage.includes("sqlite")) {
		network.irc.requestCap("znc.in/playback");
	}

	events.forEach((plugin) => {
		require(`./plugins/irc-events/${plugin}`).apply(client, [
			network.irc,
			network,
		]);
	});

	network.irc.connect();

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
		friendlyAgent += ` on ${agent.os.name} ${agent.os.version}`;
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

	if (cmd in inputs) {
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
	};
};

Client.prototype.open = function(socketId, target) {
	// Opening a window like settings
	if (target === null) {
		this.attachedClients[socketId].openChannel = -1;
		return;
	}

	target = this.find(target);

	if (!target) {
		return;
	}

	target.chan.firstUnread = 0;
	target.chan.unread = 0;
	target.chan.highlight = 0;

	this.attachedClients[socketId].openChannel = target.chan.id;
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
		this.networks.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

		// Sync order to connected clients
		this.emit("sync_sort", {order: this.networks.map((obj) => obj.id), type: data.type, target: data.target});

		break;

	case "channels": {
		const network = _.find(this.networks, {id: data.target});

		if (!network) {
			return;
		}

		network.channels.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

		// Sync order to connected clients
		this.emit("sync_sort", {order: network.channels.map((obj) => obj.id), type: data.type, target: data.target});

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

	if (this.messageStorage) {
		this.messageStorage.close();
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
