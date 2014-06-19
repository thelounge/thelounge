var _ = require("lodash");
var config = require("../config") || {};
var fs = require("fs");
var http = require("connect");
var io = require("socket.io");
var irc = require("slate-irc");
var net = require("net");
var tls = require("tls");

var Msg = require("./models/msg");
var Network = require("./models/network");

var sockets = null;
var networks = [];

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
	
	sockets = io.listen(app, {log: 0}).sockets.on("connection", function(socket) {
		init.call(
			socket,
			!!config.password
		);
	});
	
	(config.networks || []).forEach(function(n) {
		connect(n);
	});
}

function init(login) {
	if (login) {
		this.on("auth", auth);
		this.emit("auth");
	} else {
		this.join("chat");
		this.on("debug", debug);
		this.on("input", input);
		this.on("fetch", fetch);
		this.emit(
			"networks",
			{networks: networks}
		);
	}
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

function connect(params) {
	_.defaults(
		params,
		config.defaults
	);
	
	var host = params.host;
	var port = params.port || 6667;
	var options = {
		host: host,
		port: port,
	};

	var stream = params.tls ? tls.connect(options) : net.connect(options);
	
	stream.on("error", function(e) {
		console.log(e);
	});
	
	var client = irc(stream);
	var network = new Network({
		host: host,
		client: client,
	});
	
	networks.push(network);
	sockets.in("chat").emit("networks", {networks: networks});

	client.nick(params.nick);
	client.user(params.nick, params.realname);
	
	plugins.forEach(function(plugin) {
		require("./plugins/" + plugin).apply(network, [client, sockets]);
	});
	
	if (!params.onConnect) {
		return;
	}
	
	client.once("welcome", function() {
		client.write("PING " + network.host);
		var channels = params.onConnect.join || [];
		channels.forEach(function(chan) {
			client.join.apply(
				client,
				chan.split(' ')
			);
		});
	});
	
	client.once("pong", function() {
		var delay = 1000;
		var commands = params.onConnect.commands || [];
		commands.forEach(function(cmd) {
			setTimeout(function() {
				input({
					id: network.channels[0].id,
					text: cmd
				});
			}, delay);
			delay += 1000;
		});
	});
}

function auth(password) {
	if (password == config.password) {
		this.disable = false;
		init.call(this);
	}
}

function debug(data) {
	console.log(data);
}

function input(data) {
	var target = find(data.id);
	if (!target) {
		return;
	}
	
	var network = target.network;
	var chan = target.chan;
	
	var client = network.client;
		
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
		if (client) {
			user = client.me;
			client.send(args[1], text);
		}
		var chan = _.findWhere(network.channels, {name: args[1]});
		if (typeof chan !== "undefined") {
			var msg = new Msg({
				from: user,
				text: text,
			});
			chan.addMsg(msg)
			sockets.in("chat").emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		break;
	
	case "notice":
		if (client && args[2]) {
			client.notice(args[1], args.slice(2).join(" "));
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
		if (client) {
			user = client.me;
			client.action(chan.name, text);
		}
		var msg = new Msg({
			type: "action",
			from: user,
			text: text,
		});
		chan.addMsg(msg)
		sockets.in("chat").emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "ame":
		var type = "action";
	case "amsg":
		var user = client.me;
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
				sockets.in("chat").emit("msg", {
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
			connect({host: args[1]});
		}
		break;
	
	case "join":
		if (client && args[1]) {
			if (!args[2] || args[2].charAt(0) == "#") {
				client.join(args.slice(1));
			} else {
				client.join(
					args[1],
					args[2] // Password
				);
			}
		}
		break;
	
	case "nick":
		if (client && args[1]) {
			client.nick(args[1]);
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
			remove(id);
			sockets.in("chat").emit("part", {
				id: id,
			});
		} else if (client) {
			client.part(chan.name);
		}
		break;
	
	case "partall":
		var part = [];
		network.channels.forEach(function(c) {
			if (c.type == "channel") part.push(c.name);
		});
		console.log("PART");
		console.log(part);
		client.part(part);
		break;
	
	case "invite":
		if (client && args[2]) {
			client.invite(args[1], args[2]);
		}
		break;
	
	case "topic":
		if (client) {
			var msg = "TOPIC";
			msg += " " + chan.name;
			msg += args[1] ? " :" + args.slice(1).join(" ") : "";
			client.write(msg);
		}
		break;
	
	case "whoami":
		var user = client.me;
	case "query":
	case "whois":
		var user = user || args[1];
		if (client && user) {
			client.whois(user);
		}
		break;
	
	case "kick":
		if (client && args[1]) {
			client.kick(chan.name, args[1]);
		}
		break;
	
	case "op":
	case "deop":
	case "voice":
	case "devoice":
	case "mode":
		if (!client || !args[1]) {
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
		client.mode(
			chan.name,
			mode,
			user
		);
		break;
	
	case "quit":
	case "disconnect":
		if (client) {
			networks = _.without(networks, network);
			sockets.in("chat").emit("networks", {networks: networks});
			client.quit();
		}
		break;
	
	case "raw":
	case "send":
		if (client) {
			client.write(args.slice(1).join(" "));
		}
		break;
	}
}

function fetch(data) {
	var socket = this;
	var target = find(data.id);
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

function find(id) {
	for (var i = 0; i < networks.length; i++) {
		var result = {
			network: networks[i],
			chan: _.findWhere(networks[i].channels, {id: id}),
		};
		if (result.chan) {
			return result;
		}
	}
}

function remove(id) {
	networks.forEach(function(n) {
		n.channels = _.without(n.channels, _.findWhere(n.channels, {id: id}));
	});
}
