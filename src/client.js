var _ = require("lodash");
var config = require("../config.json");
var net = require("net");
var Msg = require("./models/msg");
var Network = require("./models/network");
var slate = require("slate-irc");
var tls = require("tls");

module.exports = Client;

var id = 0;
var events = [
	"ctcp",
	"error",
	"image",
	"join",
	"kick",
	"mode",
	"motd",
	"message",
	"names",
	"nick",
	"notice",
	"part",
	"quit",
	"topic",
	"welcome",
	"whois"
];
var inputs = [
	"action",
	"connect",
	"invite",
	"join",
	"kick",
	"mode",
	"msg",
	"nick",
	"notice",
	"part",
	"quit",
	"raw",
	"topic",
	"whois"
];

function Client(sockets, config) {
	_.merge(this, {
		config: config,
		id: id++,
		name: "",
		networks: [],
		sockets: sockets
	});
	if (config) {
		var client = this;
		_.each(config.networks || [], function(n) {
			client.connect(n);
		});
	}
}

Client.prototype.emit = function(event, data) {
	if (this.sockets !== null) {
		this.sockets.in(this.id).emit(event, data);
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
	var client = this;
	var server = _.defaults(_.pick(args, ['host', 'port', 'rejectUnauthorized', 'name']), {
		host: "irc.freenode.org",
		port: 6697,
		rejectUnauthorized: false
	});

	var stream = args.tls ? tls.connect(server) : net.connect(server);
	stream.on("error", function(e) {
		console.log("Client#connect():\n" + e);
		stream.end();
		var msg = new Msg({
			type: Msg.Type.ERROR,
			text: "Connection error."
		});
		client.emit("msg", {
			msg: msg
		});
	});

	var nick = args.nick || "shout-user";
	var realname = args.realname || "Shout User";

	var irc = slate(stream);

	if (args.password) {
		irc.pass(args.password);
	}

	irc.me = nick;
	irc.nick(nick);
	irc.user(nick, realname);

	var network = new Network({
		host: server.host,
		name: server.name,
		irc: irc
	});

	client.networks.push(network);
	client.emit("network", {
		network: network
	});

	events.forEach(function(plugin) {
		var path = "./plugins/irc-events/" + plugin;
		require(path).apply(client, [
			irc,
			network
		]);
	});

	irc.once("welcome", function() {
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
		setTimeout(function() {
			irc.write("PING " + network.host);
		}, delay);
	});

	irc.once("pong", function() {
		var join = (args.join || "");
		if (join) {
			join = join.replace(/\,/g, " ").split(/\s+/g);
			irc.join(join);
		}
	});
};

Client.prototype.input = function(data) {
	var client = this;
	var text = data.text;
	var target = client.find(data.target);
	if (text.charAt(0) !== "/") {
		text = "/say " + text;
	}
	var args = text.split(" ");
	var cmd = args.shift().replace("/", "").toLowerCase();
	_.each(inputs, function(plugin) {
		try {
			var path = "./plugins/inputs/" + plugin;
			var fn = require(path);
			fn.apply(client, [
				target.network,
				target.chan,
				cmd,
				args
			]);
		} catch (e) {
			console.log(path + ": " + e);
		}
	});
}

Client.prototype.quit = function() {
	this.networks.forEach(function(network) {
		var irc = network.irc;
		if (network.connected) {
			irc.quit();
		} else {
			irc.stream.end();
		}
	});
};
