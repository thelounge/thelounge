var _ = require("lodash");
var package = require("../package.json");
var Chan = require("./models/chan");
var crypto = require("crypto");
var userLog = require("./userLog");
var Msg = require("./models/msg");
var Network = require("./models/network");
var ircFramework = require("irc-framework");
var Helper = require("./helper");

module.exports = Client;

var id = 0;
var events = [
	"connection",
	"unhandled",
	"ctcp",
	"error",
	"invite",
	"join",
	"kick",
	"mode",
	"motd",
	"message",
	"link",
	"names",
	"nick",
	"part",
	"quit",
	"topic",
	"welcome",
	"whois"
];
var inputs = [
	"ctcp",
	"msg",
	"part",
	"action",
	"connect",
	"disconnect",
	"invite",
	"kick",
	"mode",
	"notice",
	"query",
	"quit",
	"raw",
	"topic",
].reduce(function(plugins, name) {
	var path = "./plugins/inputs/" + name;
	var plugin = require(path);
	plugin.commands.forEach(function(command) {
		plugins[command] = plugin;
	});
	return plugins;
}, {});

function Client(manager, name, config) {
	if (typeof config !== "object") {
		config = {};
	}
	_.merge(this, {
		activeChannel: -1,
		config: config,
		id: id++,
		name: name,
		networks: [],
		sockets: manager.sockets,
		manager: manager
	});

	var client = this;

	if (client.name && !client.config.token) {
		client.updateToken(function(token) {
			client.manager.updateUser(client.name, {token: token});
		});
	}

	var delay = 0;
	(client.config.networks || []).forEach(function(n) {
		setTimeout(function() {
			client.connect(n);
		}, delay);
		delay += 1000;
	});

	if (client.name) {
		log.info("User '" + client.name + "' loaded");
	}
}

Client.prototype.emit = function(event, data) {
	if (this.sockets !== null) {
		this.sockets.in(this.id).emit(event, data);
	}
	if (this.config.log === true) {
		if (event === "msg") {
			var target = this.find(data.chan);
			if (target) {
				var chan = target.chan.name;
				if (target.chan.type === Chan.Type.LOBBY) {
					chan = target.network.host;
				}
				userLog.write(
					this.name,
					target.network.host,
					chan,
					data.msg
				);
			}
		}
	}
};

Client.prototype.find = function(id) {
	var network = null;
	var chan = null;
	for (var i in this.networks) {
		var n = this.networks[i];
		chan = _.find(n.channels, {id: id});
		if (chan) {
			network = n;
			break;
		}
	}
	if (network && chan) {
		return {
			network: network,
			chan: chan
		};
	} else {
		return false;
	}
};

Client.prototype.connect = function(args) {
	var config = Helper.config;
	var client = this;

	var nick = args.nick || "lounge-user";
	var webirc = null;
	var channels = [];

	if (args.channels) {
		var badName = false;

		args.channels.forEach(function(chan) {
			if (!chan.name) {
				badName = true;
				return;
			}

			channels.push(new Chan({
				name: chan.name
			}));
		});

		if (badName && client.name) {
			log.warn("User '" + client.name + "' on network '" + args.name + "' has an invalid channel which has been ignored");
		}
	// `join` is kept for backwards compatibility when updating from versions <2.0
	// also used by the "connect" window
	} else if (args.join) {
		channels = args.join
			.replace(/\,/g, " ")
			.split(/\s+/g)
			.map(function(chan) {
				return new Chan({
					name: chan
				});
			});
	}

	var network = new Network({
		name: args.name || "",
		host: args.host || "",
		port: parseInt(args.port, 10) || (args.tls ? 6697 : 6667),
		tls: !!args.tls,
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
		networks: [network]
	});

	if (config.lockNetwork) {
		// This check is needed to prevent invalid user configurations
		if (args.host && args.host.length > 0 && args.host !== config.defaults.host) {
			network.channels[0].pushMessage(client, new Msg({
				type: Msg.Type.ERROR,
				text: "Hostname you specified is not allowed."
			}), true);
			return;
		}

		network.host = config.defaults.host;
		network.port = config.defaults.port;
		network.tls = config.defaults.tls;
	}

	if (network.host.length === 0) {
		network.channels[0].pushMessage(client, new Msg({
			type: Msg.Type.ERROR,
			text: "You must specify a hostname to connect."
		}), true);
		return;
	}

	if (config.webirc && network.host in config.webirc) {
		args.ip = args.ip || (client.config && client.config.ip) || client.ip;
		args.hostname = args.hostname || (client.config && client.config.hostname) || client.hostname || args.ip;

		if (args.ip) {
			if (config.webirc[network.host] instanceof Function) {
				webirc = config.webirc[network.host](client, args);
			} else {
				webirc = {
					password: config.webirc[network.host],
					username: package.name,
					address: args.ip,
					hostname: args.hostname
				};
			}
		} else {
			log.warn("Cannot find a valid WEBIRC configuration for " + nick
				+ "!" + network.username + "@" + network.host);
		}
	}

	network.irc = new ircFramework.Client();

	network.irc.requestCap([
		"echo-message",
		"znc.in/self-message",
	]);

	events.forEach(function(plugin) {
		var path = "./plugins/irc-events/" + plugin;
		require(path).apply(client, [
			network.irc,
			network
		]);
	});

	network.irc.connect({
		version: package.name + " " + package.version + " -- " + package.homepage,
		host: network.host,
		port: network.port,
		nick: nick,
		username: network.username,
		gecos: network.realname,
		password: network.password,
		tls: network.tls,
		localAddress: config.bind,
		rejectUnauthorized: false,
		auto_reconnect: true,
		auto_reconnect_wait: 10000 + Math.floor(Math.random() * 1000), // If multiple users are connected to the same network, randomize their reconnections a little
		auto_reconnect_max_retries: 360, // At least one hour (plus timeouts) worth of reconnections
		webirc: webirc,
	});
};

Client.prototype.updateToken = function(callback) {
	var client = this;

	crypto.randomBytes(48, function(err, buf) {
		callback(client.config.token = buf.toString("hex"));
	});
};

Client.prototype.setPassword = function(hash, callback) {
	var client = this;

	client.updateToken(function(token) {
		client.manager.updateUser(client.name, {
			token: token,
			password: hash
		});

		// re-read the hash off disk to ensure we use whatever is saved. this will
		// prevent situations where the password failed to save properly and so
		// a restart of the server would forget the change and use the old
		// password again.
		var user = client.manager.readUserConfig(client.name);
		if (user.password === hash) {
			client.config.password = hash;
			callback(true);
		} else {
			callback(false);
		}
	});
};

Client.prototype.input = function(data) {
	var client = this;
	data.text.split("\n").forEach(function(line) {
		data.text = line;
		client.inputLine(data);
	});
};

Client.prototype.inputLine = function(data) {
	var client = this;
	var text = data.text;
	var target = client.find(data.target);

	// This is either a normal message or a command escaped with a leading '/'
	if (text.charAt(0) !== "/" || text.charAt(1) === "/") {
		text = "say " + text.replace(/^\//, "");
	} else {
		text = text.substr(1);
	}

	var args = text.split(" ");
	var cmd = args.shift().toLowerCase();

	var irc = target.network.irc;
	var connected = irc && irc.connection && irc.connection.connected;

	if (cmd in inputs) {
		var plugin = inputs[cmd];
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
			text: "You are not connected to the IRC network, unable to send your command."
		}));
	}
};

Client.prototype.more = function(data) {
	var client = this;
	var target = client.find(data.target);
	if (!target) {
		return;
	}
	var chan = target.chan;
	var count = chan.messages.length - (data.count || 0);
	var messages = chan.messages.slice(Math.max(0, count - 100), count);
	client.emit("more", {
		chan: chan.id,
		messages: messages
	});
};

Client.prototype.open = function(data) {
	var target = this.find(data);
	if (target) {
		target.chan.firstUnread = 0;
		target.chan.unread = 0;
		target.chan.highlight = false;
		this.activeChannel = target.chan.id;
	}
};

Client.prototype.sort = function(data) {
	var self = this;

	var type = data.type;
	var order = data.order || [];
	var sorted = [];

	switch (type) {
	case "networks":
		_.each(order, function(i) {
			var find = _.find(self.networks, {id: i});
			if (find) {
				sorted.push(find);
			}
		});
		self.networks = sorted;
		break;

	case "channels":
		var target = data.target;
		var network = _.find(self.networks, {id: target});
		if (!network) {
			return;
		}
		_.each(order, function(i) {
			var find = _.find(network.channels, {id: i});
			if (find) {
				sorted.push(find);
			}
		});
		network.channels = sorted;
		break;
	}

	self.save();
};

Client.prototype.names = function(data) {
	var client = this;
	var target = client.find(data.target);
	if (!target) {
		return;
	}

	client.emit("names", {
		id: target.chan.id,
		users: target.chan.users
	});
};

Client.prototype.quit = function() {
	var sockets = this.sockets.sockets;
	var room = sockets.adapter.rooms[this.id] || [];
	for (var user in room) {
		var socket = sockets.adapter.nsp.connected[user];
		if (socket) {
			socket.disconnect();
		}
	}
	this.networks.forEach(function(network) {
		if (network.irc) {
			network.irc.quit("Page closed");
		}
	});
};

var timer;
Client.prototype.save = function(force) {
	var client = this;

	if (Helper.config.public) {
		return;
	}

	if (!force) {
		clearTimeout(timer);
		timer = setTimeout(function() {
			client.save(true);
		}, 1000);
		return;
	}

	var networks = _.map(
		this.networks,
		function(n) {
			return n.export();
		}
	);

	var json = {};
	json.networks = networks;
	client.manager.updateUser(client.name, json);
};
