var http   = require("connect");
var io     = require("socket.io");
var irc    = require("slate-irc");
var models = require(__dirname + "/models");
var net    = require("net");
var _      = require("lodash");

var sockets;
var networks = new models.Networks;

var events = [
	"away",
	"join",
	"kick",
	"names",
	"nick",
	"notice",
	"part",
	"pong",
	"privmsg",
	"quit",
	"topic",
	"welcome",
	"whois"
];

module.exports = function listen() {
	var app = http()
		.use(http.static("client"))
		.listen(9000);
	
	sockets = io.listen(app, {log: 0}).sockets.on("connection", function(s) {
		s.on("input", input);
		sockets.emit("network", networks);
	});
	
	networks.on("all", function() {
		sockets.emit.apply(sockets, arguments);
	});
};

function connect(host) {
	var network = new models.Network({host: host}, {silent: true});
	networks.add(network);
	networks.trigger("network", networks);
	
	var stream = net.connect({
		port: 6667,
		host: host,
	});
	
	stream.on("error", function(e) {
		console.log(e);
	});
	
	var client = irc(stream);
	
	client.nick("t_user");
	client.user("t_user", "temp user");
	
	events.forEach(function(e) {
		client.on(e, function(data) {
			event.apply(network, [e, data]);
		});
	});
}

function input(json) {
	var target = networks.find(json.id);
	if (!target) {
		return;
	}

	var network = target.network;
	var channel = target.channel;
	
	var id   = json.id;
	var text = json.text;
	
	var args = text.replace(/^\//, '').split(" ");
	var cmd  = text.charAt(0) == "/" ? args[0].toLowerCase() : "";
	
	switch (cmd) {
	
	case "":
		args.unshift(
			"msg",
			channel.get("name")
		);
	case "msg": 
		channel.get("messages").add(new models.Message({text: _.tail(args, 2)}));
		break;
	
	case "server":
	case "connect":
		if (args[1]) {
			connect(args[1]);
		}
		break;
	
	case "quit":
	case "disconnect":
		networks.remove(network);
		break;
	
	}
}

function event(event, data) {
	var network  = this;
	var channels = network.get("channels");
		
	switch (event) {
	
	case "away":
		console.log(event);
		break;
	
	case "join":
		console.log(event);
		break;
	
	case "kick":
		console.log(event);
		break;
	
	case "names":
		console.log(event);
		break;
	
	case "nick":
		console.log(event);
		break;
	
	case "notice":
		channels.first().get("messages").add(new models.Message(data));
		break;
	
	case "part":
		console.log(event);
		break;
	
	case "pong":
		console.log(event);
		break;
	
	case "privmsg":
		console.log(event);
		break;
	
	case "quit":
		console.log(event);
		break;
	
	case "topic":
		console.log(event);
		break;
	
	case "welcome":
		console.log(event);
		break;
	
	case "whois":
		console.log(event);
		break;
	
	}
	
	// Debug
	console.log(data);
}