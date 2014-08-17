var _ = require("lodash");
var config = require("../config.json");
var net = require("net");
var Network = require("./models/network");
var slate = require("slate-irc");
var tls = require("tls");

module.exports = Client;

var id = 0;
var events = [
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
	var server = {
		host: args.host || "irc.freenode.org",
		port: args.port || 6667
	};

	var stream = args.tls ? tls.connect(server) : net.connect(server);
	stream.on("error", function(e) {
		console.log(e);
	});

	var nick = args.nick || "shout-user";
	var realname = args.realname || "Shout User";

	var irc = slate(stream);
	irc.me = nick;
	irc.nick(nick);
	irc.user(nick, realname);

	var network = new Network({
		host: server.host,
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

	var join = (args.join || "#shout-irc").replace(/\,/g, " ").split(/\s+/g);
	irc.on("welcome", function() {
		irc.join(join);
	});
};

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
