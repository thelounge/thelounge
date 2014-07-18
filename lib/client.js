var _ = require("lodash");
var config = require("../config");
var net = require("net");
var Network = require("./models/network");
var slate = require("slate-irc");
var tls = require("tls");

module.exports = Client;

var id = 0;
var events = [
	"errors",
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

function Client(sockets) {
	_.merge(this, {
		networks: [],
		id: id++,
		sockets: sockets
	});
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
	var options = {
		host: args.host || config.defaults.host,
		port: args.port || config.defaults.port
	};

	var stream = args.tls ? tls.connect(options) : net.connect(options);
	stream.on("error", function(e) {
		console.log(e);
	});

	var nick = args.nick || config.defaults.nick;
	var realname = args.realname || config.defaults.realname;

	var irc = slate(stream);
	irc.me = nick;
	irc.nick(nick);
	irc.user(nick, realname);

	var network = new Network({
		host: options.host,
		irc: irc
	});

	client.networks.push(network);
	client.emit("network", {
		network: network
	});

	events.forEach(function(plugin) {
		require("./plugins/irc-events/" + plugin).apply(client, [
			irc,
			network
		]);
	});

	var join = (args.join || config.defaults.join).replace(/\,/g, " ").split(/\s+/g);
	irc.on("welcome", function() {
		irc.join(join);
	});
};

Client.prototype.quit = function() {
	this.networks.forEach(function(network) {
		var irc = network.irc;
		if (network.connected) {
			irc.quit("");
		} else {
			irc.stream.end();
		}
	});
};
