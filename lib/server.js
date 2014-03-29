var http   = require("connect");
var io     = require("socket.io");
var irc    = require("slate-irc");
var models = require(__dirname + "/models");
var net    = require("net");
var _      = require("lodash");

var sockets  = null;
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
	var stream = net.connect({
		port: 6667,
		host: host,
	});
	
	stream.on("error", function(e) {
		console.log(e);
	});
	
	var client = irc(stream);
	var network = networks.add({
		host: host,
		client: client,
	}, {silent: true});
	
	networks.trigger("network", networks);
	
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
		channel.addMessage({
			message: _.tail(args, 2).join(" ")
		});
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
	
	case "join":
		if (args[1]) {
			network.get("client").join(args[1]);
		}
		break;
	
	case "part":
		if (args[1]) {
			network.get("client").part(args[1]);
		}
		break;
	
	}
}

function event(event, data) {
	var channels = this.get("channels");
	
	switch (event) {
	
	case "away":
		console.log(event);
		break;
	
	case "join":
		var chan = channels.findWhere({name: data.channel}) || channels.add({name: data.channel});
		chan.addUser({name: data.nick});
		chan.addMessage({
			user: data.nick,
			type: "join",
		});
		break;
	
	case "kick":
		console.log(event);
		break;
	
	case "names":
		var chan = channels.findWhere({name: data.channel});
		chan.get("users").reset(_.map(data.names, function(n) { return {name: n}; }));
		break;
	
	case "nick":
		console.log(event);
		break;
	
	case "notice":
		channels.first().addMessage(data);
		break;
	
	case "part":
		var len  = data.channels.length;
		var name = data.nick;
		for (var i = 0; i < len; i++) {
			var chan = channels.findWhere({name: data.channels[i]});
			if (name == this.get("client").me) {
				channels.remove(chan);
				return;
			}
			var users = channel.get("users");
			users.remove(users.findWhere({name: name}));
			chan.addMessage({
				user: data.nick,
				type: "part",
			});
		}
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
		channels.first().addMessage({message: "Connected."});
		break;
	
	case "whois":
		console.log(event);
		break;
	
	}
	
	// Debug
	console.log(data);
}