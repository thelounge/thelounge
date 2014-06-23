var _ = require("lodash");
var config = require("../config") || {};
var fs = require("fs");
var http = require("connect");
var io = require("socket.io");
var irc = require("slate-irc");
var net = require("net");
var tls = require("tls");

var Client = require("./models/client");
var Msg = require("./models/msg");
var Network = require("./models/network");

var sockets = null;
var clients = [];

var plugins = [
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
	"whois",
];

module.exports = function listen() {
	var port = config.port || 9000;
	var app = http()
		.use(index)
		.use(http.static("client"))
		.listen(port);
	
	sockets = io.listen(app, {log: 0});
	
	var users = config.users;
	for (var user in users) {
		var client = new Client({
			name: user,
			config: users[user],
			sockets: sockets
		});
		clients.push(client);
		users[user].networks.forEach(function(network) {
			connect(client, network);
		});
	}
	
	sockets.on("connection", function(socket) {
		if (clients.length == 1 && !clients[0].config.password) {
			init.call(socket, clients[0]);
		} else {
			init.call(socket);
		}
	});
}

function index(req, res, next) {
	if (req.url != "/") return next();
	return fs.readFile("client/index.html", function(err, file) {
		var data = _.merge(
			require("../package.json"),
			config
		);
		res.end(_.template(
			file,
			data
		));
	});
}

function init(client) {
	var socket = this;
	if (!client) {
		socket.on("auth", auth);
		socket.emit("auth");
	} else {
		socket.on("input", function(data) { input(client, data); });
		socket.on("fetch", function(data) { fetch(client, socket, data); });
		socket.join(client.name);
		socket.emit("networks", {
			networks: client.networks
		});
	}
}

function auth(data) {
	var user = config.users[data.user];
	if (user && data.password == user.password) {
		var socket = this;
		clients.forEach(function(c) {
			if (c.name == data.user) init.call(socket, c);
		});
	}
}

function connect(client, params) {
	var host = params.host;
	var port = params.port || 6667;
	var options = {
		host: host,
		port: port
	};
	
	var stream = params.tls ? tls.connect(options) : net.connect(options);
	stream.on("error", function(e) {
		console.log(e);
	});
	
	var slate = irc(stream);
	slate.nick(client.config.nick);
	slate.user(client.config.nick, client.config.realname);
	
	var network = new Network({
		client: client,
		host: host,
		slate: slate,
	});
	
	client.networks.push(network);
	client.emit("networks", {
		networks: client.networks
	});
	
	plugins.forEach(function(plugin) {
		require("./plugins/" + plugin).apply(client, [slate, network]);
	});
	
	slate.on("welcome", function() {
		((params.onConnect || {}).join || []).forEach(function(chan) {
			slate.join.apply(
				slate,
				chan.split(" ")
			);
		});
	});
}

function input(client, data) {
	var target = find(client.networks, data.id);
	if (!target) {
		return;
	}
	
	var network = target.network;
	var chan = target.chan;
	
	var slate = network.slate;
	
	var id = data.id;
	var text = data.text;
	if (!text) {
		return;
	}
	
	var args = text.replace(/^\//, '').split(" ");
	var cmd = text.charAt(0) == "/" ? args[0].toLowerCase() : "";
	
	switch (cmd) {
	case "say":
		// Remove '/say' and treat this command as a message.
		args.shift();
	case "":
		args.unshift(
			"msg",
			chan.name
		);
	case "msg":
		var user;
		var text = args.slice(2).join(" ");
		if (slate) {
			user = slate.me;
			slate.send(args[1], text);
		}
		var chan = _.findWhere(network.channels, {name: args[1]});
		if (typeof chan !== "undefined") {
			var msg = new Msg({
				from: user,
				text: text,
			});
			chan.addMsg(msg)
			client.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		break;
	
	case "notice":
		if (slate && args[2]) {
			slate.notice(args[1], args.slice(2).join(" "));
		}
		break;
	
	case "slap":
		var slap = "slaps " + args[1] + " around a bit with a large trout";
	case "me":
		if (!args[1]) {
			break;
		}
		var user;
		var text = slap || args.slice(1).join(" ");
		if (slate) {
			user = slate.me;
			slate.action(chan.name, text);
		}
		var msg = new Msg({
			type: "action",
			from: user,
			text: text,
		});
		chan.addMsg(msg)
		client.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "ame":
		var type = "action";
	case "amsg":
		var user = slate.me;
		var text = args.slice(1).join(" ");
		var channels = [];
		network.channels.forEach(function(chan) {
			if (chan.type == "channel") {
				channels.push(chan.name);
				var msg = new Msg({
					type: type || "normal",
					from: user,
					text: text,
				});
				chan.addMsg(msg)
				client.emit("msg", {
					id: chan.id,
					msg: msg,
				});
			}
		});
		client[type || "send"](
			channels,
			text
		);
		break;
	
	case "server":
	case "connect":
		if (args[1]) {
			connect(client, {host: args[1]});
		}
		break;
	
	case "join":
		if (slate && args[1]) {
			if (!args[2] || args[2].charAt(0) == "#") {
				slate.join(args.slice(1));
			} else {
				slate.join(
					args[1],
					args[2] // Password
				);
			}
		}
		break;
	
	case "nick":
		if (slate && args[1]) {
			slate.nick(args[1]);
		}
		break;
	
	case "part":
		if (chan.type != "channel") {
			return;
		}
	case "close":
	case "leave":
		if (chan.type == "lobby") {
			return;
		}
		var id = chan.id;
		if (chan.type == "query" || !chan.users.length) {
			client.networks.forEach(function(n) {
				n.channels = _.without(n.channels, _.findWhere(n.channels, {id: id}));
			});
			client.emit("part", {
				id: id,
			});
		} else if (slate) {
			slate.part(chan.name);
		}
		break;
	
	case "partall":
		var part = [];
		network.channels.forEach(function(c) {
			if (c.type == "channel") part.push(c.name);
		});
		slate.part(part);
		break;
	
	case "invite":
		if (slate && args[2]) {
			slate.invite(args[1], args[2]);
		}
		break;
	
	case "topic":
		if (slate) {
			var msg = "TOPIC";
			msg += " " + chan.name;
			msg += args[1] ? " :" + args.slice(1).join(" ") : "";
			slate.write(msg);
		}
		break;
	
	case "whoami":
		var user = slate.me;
	case "query":
	case "whois":
		var user = user || args[1];
		if (slate && user) {
			slate.whois(user);
		}
		break;
	
	case "kick":
		if (slate && args[1]) {
			slate.kick(chan.name, args[1]);
		}
		break;
	
	case "op":
	case "deop":
	case "voice":
	case "devoice":
	case "mode":
		if (!slate || !args[1]) {
			break;
		}
		var mode;
		var user;
		if (cmd != "mode") {
			user = args[1];
			mode = {
			     "op": "+o",
			   "deop": "-o",
			  "voice": "+v",
			"devoice": "-v",
			}[cmd];
		} else if (!args[2]) {
			break;
		} else {
			mode = args[1];
			user = args[2];
		}
		slate.mode(
			chan.name,
			mode,
			user
		);
		break;
	
	case "quit":
	case "disconnect":
		if (client) {
			client.networks = _.without(client.networks, network);
			client.emit("networks", {networks: client.networks});
			slate.quit();
		}
		break;
	
	case "raw":
	case "send":
		if (slate) {
			slate.write(args.slice(1).join(" "));
		}
		break;
	}
}

function fetch(client, socket, data) {
	var target = find(client.networks, data.id);
	if (!target) {
		return;
	}
	
	var chan = target.chan;
	var messages = chan
		.messages
		.slice(0, chan.messages.length - (data.count || 0));
	
	socket.emit("messages", {
		id: data.id,
		msg: messages,
	});
}

function find(networks, id) {
	for (var i = 0; i < networks.length; i++) {
		var result = {
			network: networks[i],
			chan: _.findWhere(networks[i].channels, {id: id}),
		};
		if (result.chan) {
			return result;
		}
	}
	return false;
}
