var _ = require("lodash");
var Chan = require("./models/chan");
var crypto = require("crypto");
var log = require("./log");
var Msg = require("./models/msg");
var Network = require("./models/network");
var ircFramework = require("irc-framework");
var Helper = require("./helper");

module.exports = Client;

var id = 0;
var events = [
	"connection",
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
	crypto.randomBytes(48, function(err, buf) {
		client.token = buf.toString("hex");
	});
	if (config) {
		var delay = 0;
		(config.networks || []).forEach(function(n) {
			setTimeout(function() {
				client.connect(n);
			}, delay);
			delay += 1000;
		});
	}
}

Client.prototype.emit = function(event, data) {
	if (this.sockets !== null) {
		this.sockets.in(this.id).emit(event, data);
	}
	var config = this.config || {};
	if (config.log === true) {
		if (event === "msg") {
			var target = this.find(data.chan);
			if (target) {
				var chan = target.chan.name;
				if (target.chan.type === Chan.Type.LOBBY) {
					chan = target.network.host;
				}
				log.write(
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
	var config = Helper.getConfig();
	var client = this;

	var nick = args.nick || "lounge-user";

	var network = new Network({
		name: args.name || "",
		host: args.host || "",
		port: parseInt(args.port, 10) || (args.tls ? 6697 : 6667),
		tls: !!args.tls,
		password: args.password,
		username: args.username || nick.replace(/[^a-zA-Z0-9]/g, ""),
		realname: args.realname || "The Lounge User",
		commands: args.commands
	});

	client.networks.push(network);
	client.emit("network", {
		network: network
	});

	if (config.lockNetwork) {
		// This check is needed to prevent invalid user configurations
		if (args.host && args.host.length > 0 && args.host !== config.defaults.host) {
			client.emit("msg", {
				chan: network.channels[0].id,
				msg: new Msg({
					type: Msg.Type.ERROR,
					text: "Hostname you specified is not allowed."
				})
			});
			return;
		}

		network.host = config.defaults.host;
		network.port = config.defaults.port;
		network.tls = config.defaults.tls;
	}

	if (network.host.length === 0) {
		client.emit("msg", {
			chan: network.channels[0].id,
			msg: new Msg({
				type: Msg.Type.ERROR,
				text: "You must specify a hostname to connect."
			})
		});
		return;
	}

	network.irc = new ircFramework.Client();
	network.irc.connect({
		host: network.host,
		port: network.port,
		nick: nick,
		username: network.username,
		gecos: network.realname,
		password: network.password,
		tls: network.tls,
		localAddress: config.bind,
		rejectUnauthorized: false,
		auto_reconnect: false, // TODO: Enable auto reconnection
	});

	network.irc.on("registered", function() {
		var delay = 1000;
		var commands = args.commands;
		if (Array.isArray(commands)) {
			commands.forEach(function(cmd) {
				setTimeout(function() {
					client.input({
						target: network.channels[0].id,
						text: cmd
					});
				}, delay);
				delay += 1000;
			});
		}

		var join = (args.join || "");
		if (join) {
			setTimeout(function() {
				join = join.split(/\s+/);
				network.irc.join(join[0], join[1]);
			}, delay);
		}
	});

	events.forEach(function(plugin) {
		var path = "./plugins/irc-events/" + plugin;
		require(path).apply(client, [
			network.irc,
			network
		]);
	});
};

Client.prototype.setPassword = function(hash) {
	var client = this;
	client.manager.updateUser(client.name, {password:hash});
	// re-read the hash off disk to ensure we use whatever is saved. this will
	// prevent situations where the password failed to save properly and so
	// a restart of the server would forget the change and use the old
	// password again.
	var user = client.manager.readUserConfig(client.name);
	if (user.password === hash) {
		client.config.password = hash;
		return true;
	}
	return false;
};

Client.prototype.input = function(data) {
	var client = this;
	var text = data.text.trim();
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
		this.emit("msg", {
			chan: target.chan.id,
			msg: new Msg({
				type: Msg.Type.ERROR,
				text: "You are not connected to the IRC network, unable to send your command."
			})
		});
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
};

Client.prototype.names = function(data) {
	var client = this;
	var target = client.find(data.target);
	if (!target) {
		return;
	}

	client.emit("names", {
		chan: target.chan.id,
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
	var config = Helper.getConfig();

	if (config.public) {
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
