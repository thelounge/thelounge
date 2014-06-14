var _ = require("lodash");
var config = require("../config") || {};
var fs = require("fs");
var http = require("connect");
var io = require("socket.io");
var irc = require("slate-irc");
var net = require("net");

// Models

var Chan = require("./models/chan");
var Msg = require("./models/msg");
var Network = require("./models/network");
var User = require("./models/user");

var sockets = null;
var networks = [];

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
	"whois",
];

module.exports = listen;

function listen() {
	var port = config.port || 9000;
	var app = http()
		.use(index)
		.use(http.static("client"))
		.listen(port);
	
	var self = this;
	sockets = io.listen(app, {log: 0}).sockets.on("connection", function(s) {
		s.emit("networks", {networks: networks});
		s.on("input", input);
		s.on("fetch", function(data) {
			fetch(s, data);
		});
	});
	
	(config.networks || []).forEach(function(n) {
		connect(n);
	});
}

function index(req, res, next) {
	if (req.url != "/") return next();
	fs.readFile("client/index.html", function(err, file) {
		var data = _.merge(
			require("../package.json"),
			{} // config
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
	
	var stream = net.connect({
		port: port,
		host: host,
	});
	
	stream.on("error", function(e) {
		console.log(e);
	});
	
	var client = irc(stream);
	var network = new Network({
		host: host,
		client: client,
	});
	
	networks.push(network);
	sockets.emit("networks", {networks: networks});

	client.nick(params.nick);
	client.user(params.nick, params.realname);
	
	client.once("welcome", function() {
		(params.channels || []).forEach(function(c) {
			client.join.apply(
				client,
				c.split(' ')
			);
		});
	});
	
	events.forEach(function(e) {
		client.on(e, function() {
			event.apply(network, [e, arguments]);
		});
	});
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
			chan.messages.push(msg)
			sockets.emit("msg", {
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
		chan.messages.push(msg)
		sockets.emit("msg", {
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
				chan.messages.push(msg)
				sockets.emit("msg", {
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
				console.log(args[1], args[2]);
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
			sockets.emit("part", {
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
			sockets.emit("networks", {networks: networks});
			client.quit();
		}
		break;
	
	// Send raw IRC messages.
	case "raw":
	case "send":
		if (client) {
			client.write(args.slice(1).join(" "));
		}
		break;
	}
}

function fetch(socket, data) {
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

function event(e, data) {
	var data = _.last(data);
	var channels = this.channels;
	
	switch (e) {
	case "errors":
		sockets.emit("msg", {
			msg: new Msg({
				type: "error",
				from: "-!-",
				text: data.message,
			}),
		});
		if (!this.connected) {
			if (data.cmd == "ERR_NICKNAMEINUSE") {
				var random = config.defaults.nick + Math.floor(10 + (Math.random() * 89));
				this.client.nick(random);
			}
		}
		break;
	
	case "join":
		var chan = _.findWhere(channels, {name: data.channel});
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.channel,
			});
			channels.push(chan);
			sockets.emit("join", {
				id: this.id,
				chan: chan,
			});
		}
		var users = chan.users;
		users.push(new User({name: data.nick}));
		chan.sortUsers();
		sockets.emit("users", {
			id: chan.id,
			users: users,
		});
		var msg = new Msg({
			from: data.nick,
			type: "join",
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "kick":
		var chan = _.findWhere(channels, {name: data.channel});
		if (typeof chan === "undefined") {
			break;
		}
		if (data.client == this.client.me) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.client}));
		}
		sockets.emit("users", {
			id: chan.id,
			users: chan.users,
		});
		var msg = new Msg({
			type: "kick",
			from: data.nick,
			text: data.client,
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "mode":
		var chan = _.findWhere(channels, {name: data.target});
		if (typeof chan !== "undefined") {
			clearTimeout(this.timer);
			this.timer = setTimeout((function() {
				this.client.write("NAMES " + data.target);
			}).bind(this), 200);
			var nick = data.nick;
			if (nick.indexOf(".") !== -1) {
				nick = data.target;
			}
			var msg = new Msg({
				type: "mode",
				from: nick,
				text: data.mode + " " + data.client,
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		break;
	
	case "motd":
		var chan = channels[0];
		data.motd.forEach(function(m) {
			var msg = new Msg({
				type: "motd",
				from: "-!-",
				text: m,
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
		break;
	
	case "message":
		var target = data.to;
		var chan = _.findWhere(channels, {name: target.charAt(0) == "#" ? target : data.from});
		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.from,
				type: "query",
			});
			channels.push(chan);
			sockets.emit("join", {
				id: this.id,
				chan: chan,
			});
		}
		var type = "";
		var text = data.message;
		if (text.split(" ")[0] === "\u0001ACTION") {
			type = "action";
			text = text.replace(/\u0001|ACTION/g, "");
		}
		var network = this;
		text.split(' ').forEach(function(w) {
			if (w.indexOf(network.client.me) == 0) type += " highlight";
		});
		var msg = new Msg({
			type: type || "normal",
			from: data.from,
			text: text,
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "names":
		var chan = _.findWhere(channels, {name: data.channel});
		if (typeof chan === "undefined") {
			break;
		}
		chan.users = [];
		_.each(data.names, function(n) {
			chan.users.push(new User(n));
		});
		chan.sortUsers();
		sockets.emit("users", {
			id: chan.id,
			users: chan.users,
		});
		break;
	
	case "nick":
		if (data["new"] == this.client.me) {
			var chan = channels[0];
			var msg = new Msg({
				from: "-!-",
				text: "You're now known as " + data["new"],
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (!user) {
				return;
			}
			user.name = data["new"];
			chan.sortUsers();
			sockets.emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "nick",
				from: data.nick,
				text: data["new"],
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
		break;
	
	case "notice":
		var chan = channels[0];
		var from = data.from || "-!-";
		if (data.to == "*" || data.from.indexOf(".") !== -1) {
			from = "-!-";
		}
		var msg = new Msg({
			type: "notice",
			from: from,
			text: data.message,
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "part":
		var chan = _.findWhere(channels, {name: data.channels[0]});
		if (typeof chan === "undefined") {
			break;
		}
		if (data.nick == this.client.me) {
			remove(chan.id);
			sockets.emit("part", {
				id: chan.id,
			});
		} else {
			chan.users = _.without(chan.users, _.findWhere(chan.users, {name: data.nick}));
			sockets.emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "part",
				from: data.nick,
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		break;
	
	case "quit":
		channels.forEach(function(chan) {
			var user = _.findWhere(chan.users, {name: data.nick});
			if (!user) {
				return;
			}
			chan.users = _.without(chan.users, user);
			sockets.emit("users", {
				id: chan.id,
				users: chan.users,
			});
			var msg = new Msg({
				type: "quit",
				from: data.nick,
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		});
		break;
	
	case "topic":
		var chan = _.findWhere(channels, {name: data.channel});
		if (typeof chan === "undefined") {
			break;
		}
		var from = data.nick || chan.name;
		var msg = new Msg({
			type: "topic",
			from: from,
			text: data.topic,
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "welcome":
		this.connected = true;
		var chan = channels[0];
		var msg = new Msg({
			from: "-!-",
			text: "You're now known as " + data,
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	
	case "whois":
		if (!data) {
			break;
		}
		var chan = _.findWhere(channels, {name: data.nickname});
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: "query",
				name: data.nickname,
			});
			channels.push(chan);
			sockets.emit("join", {
				id: this.id,
				chan: chan,
			});
		}
		var prefix = {
			hostname: "from",
			realname: "is",
			channels: "on",
			server: "using",
		};
		var i = 0;
		for (var k in data) {
			var key = prefix[k];
			if (!key || data[k].toString() == "") {
				continue;
			}
			var msg = new Msg({
				type: "whois",
				from: data.nickname,
				text: key + " " + data[k],
			});
			chan.messages.push(msg);
			sockets.emit("msg", {
				id: chan.id,
				msg: msg,
			});
		}
		var msg = new Msg({
			type: "whois",
			from: data.nickname,
			text: "End of /WHOIS list.",
		});
		chan.messages.push(msg);
		sockets.emit("msg", {
			id: chan.id,
			msg: msg,
		});
		break;
	}
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
