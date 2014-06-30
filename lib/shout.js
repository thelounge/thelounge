var _ = require("lodash");
var Client = require("./models/client");
var config = require("../config") || {};
var http = require("connect");
var net = require("net");
var Network = require("./models/network");
var io = require("socket.io");
var slate = require("slate-irc");
var tls = require("tls");

var sockets = null;
var clients = [];

var inputs = [
	"action",
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
	"server",
	"topic",
	"whois"
];

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

module.exports = function() {
	sockets = io(http().use(http.static("client")).listen(config.port || 9000));
	sockets.on("connection", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}
	});
};

function init(socket, client) {
	if (!client) {
		socket.emit("auth");
		socket.on("auth", auth);
	} else {
		socket.on("input", function(data) { input(client, data); });
		socket.join(client.id);
		socket.emit("init", {
			networks: client.networks
		});
	}
}

function auth(data) {
	var socket = this;
	if (config.public) {
		// Temporary:
		var client = clients[0];
		if (clients.length === 0) {
			var client = new Client({sockets: sockets});
			clients.push(client);
			connect(client, {
				host: "irc.freenode.org"
			});
		}
		init(socket, client);
	} else {
		if (false) {
			// ..
		}
	}
}

function connect(client, args) {
	var options = {
		host: args.host,
		port: args.port || 6667
	};
	
	var stream = args.tls ? tls.connect(options) : net.connect(options);
	stream.on("error", function(e) {
		console.log(e);
	});
	
	var irc = slate(stream);
	irc.nick("shout");
	irc.user("shout", "Shout User");
	
	client.nick = "shout";
	
	var network = new Network({
		host: options.host,
		irc: irc
	});
	
	client.networks.push(network);
	client.emit("network", {
		network: network
	});
	
	events.forEach(function(plugin) {
		require("./plugins/irc-events/" + plugin).apply(client, [irc, network]);
	});
	
	irc.on("welcome", function() {
		irc.join("#shout-test");
	});
}

function input(client, data) {
	console.log(data);
}
