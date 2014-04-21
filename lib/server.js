var models = require(__dirname + "/models.js");
var config = require(__dirname + "/../config.js");
var http   = require("connect");
var io     = require("socket.io");
var irc    = require("slate-irc");
var net    = require("net");
var _      = require("lodash");

var sockets  = null;
var networks = new models.Networks;

var events = [
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
	var app = http()
		.use(http.static("client"))
		.listen(9000);
	
	sockets = io.listen(app, {log: 0}).sockets.on("connection", function(s) {
		s.on("input", input);
		sockets.emit("network", {
			data: networks,
		});
	});
	
	networks.on("all", function() {
		sockets.emit.apply(sockets, arguments);
	});
	
	config.servers.forEach(function(s) {
		connect(s);
	});
};

function connect(params) {
	params = _.extend(
		config.defaults,
		params
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
	var network = networks.add({
		host: host,
		client: client,
	}, {silent: true});
	
	networks.trigger("network", {data: networks});
	
	client.nick(params.nick);
	client.user(params.nick, params.realname);
	
	client.once("welcome", function() {
		params.channels.forEach(function(c) {
			client.join(c);
		});
	});
	
	events.forEach(function(e) {
		client.on(e, function() {
			event.apply(network, [e, arguments]);
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
	
	var client = network.get("client");
	
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
		var user;
		var message = _.tail(args, 2).join(" ");
		if (client) {
			user = client.me;
			client.send(args[1], message);
		}
		channel.get("messages").add({
			from: user,
			text: message,
		});
		break;
	
	case "server":
	case "connect":
		if (args[1]) {
			connect({host: args[1]});
		}
		break;
	
	case "join":
	case "nick":
		if (client && args[1]) {
			client[cmd].apply(client, args.slice(1));
		}
		break;
	
	case "leave":
	case "part":
		if (channel.get("type") == "query") {
			network.get("channels").remove(channel);
		} else if (client) {
			client.part(channel.get("name"));
		}
		break;
	
	case "topic":
		var chan = channel.get("name");
		if (client) {
			var str = "TOPIC " + chan;
			if (args[1]) {
				str += " :" + args.slice(1).join(" ");
			}
			client.write(str);
		}
		break;
	
	case "query":
	case "whois":
		if (client && args[1]) {
			client.whois(args[1]);
		}
		break;
	
	case "kick":
		if (client && args[1]) {
			client.kick(channel.get("name"), args[1]);
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
			channel.get("name"),
			mode,
			user
		);
		break;
	
	case "quit":
	case "disconnect":
		networks.remove(network);
		networks.trigger("network", {data: networks});
		break;
	
	}
}

function event(event, data) {
	var channels = this.get("channels");
	
	switch (event) {
	
	case "join":
		var chan = channels.findWhere({name: data[0].channel}) || channels.add({name: data[0].channel});
		var users = chan.get("users");
		users.add({name: data[0].nick}, {silent: true});
		if (data[0].nick != this.get("client").me) {
			users.sort();
		}
		chan.get("messages").add({
			from: data[0].nick,
			type: "join",
		});	
		break;
	
	case "kick":
		var chan = channels.findWhere({name: data[0].channel});
		var users = chan.get("users");
		
		if (data[0].client != this.get("client").me) {
			users.remove(users.findWhere({name: data[0].client}));
		} else {
			users.reset();
		}
		
		chan.get("messages").add({
			from: data[0].nick,
			text: data[0].client,
			type: "kick",
		});
		break;
	
	case "mode":
		var chan = channels.findWhere({name: data[0].target});
		if (typeof chan !== "undefined") {
			chan.get("messages").add({
				from: data[0].nick,
				text: data[0].mode + " " + data[0].client,
				type: "mode",
			});
		}
		break;
	
	case "motd":
		var messages = data[0].motd;
		messages.forEach(function(msg) {
			channels.first().get("messages").add({text: msg});
		});
		break;
	
	case "message":
		var chan = channels.findWhere({name: data[0].to}) || channels.add({type: "query", name: data[0].from});
		var type = "";
		var text = data[0].message;
		var network = this;
		text.split(" ").forEach(function(w) {
			if (w == network.get("client").me) type = "highlight";
		});
		chan.get("messages").add({
			type: type,
			from: data[0].from,
			text: text,
		});
		break;
	
	case "names":
		var chan = channels.findWhere({name: data[0].channel});
		var users = chan.get("users");
		users.reset(
			_.map(data[0].names, function(n) { return {name: n}; }),
			{silent: true}
		);
		users.sort();
		break;
	
	case "nick":
		if (data[0].new == this.get("client").me) {
			channels.first().get("messages").add({
				text: "You're now known as " + data[0]["new"],
			});
		}
		channels.each(function(chan) {
			var users = chan.get("users");
			var user = users.findWhere({name: data[0].nick});
			if (!user) {
				return;
			}
			
			user.set("name", data[0]["new"]);
			users.sort();
			
			chan.get("messages").add({
				from: data[0].nick,
				text: data[0]["new"],
				type: "nick",
			});
		});
		break;
	
	case "notice":	
		if (data[0].to = "*") {
			data[0].from = "-!-";
		}
		channels.first().get("messages").add({
			type: "notice",
			from: data[0].from,
			text: data[0].message,
		});
		break;
	
	case "part":
		var chan = channels.findWhere({name: data[0].channels[0]});
		if (data[0].nick == this.get("client").me) {
			channels.remove(chan);
			return;
		}
		var users = chan.get("users");
		users.remove(users.findWhere({name: data[0].nick}));
		users.sort();
		chan.get("messages").add({
			from: data[0].nick,
			type: "part",
		});
		break;
	
	case "quit":
		channels.each(function(chan) {
			var users = chan.get("users");
			var user = users.findWhere({name: data[0].nick});
			if (user) {
				users.remove(user);
				users.sort();
				chan.get("messages").add({
					from: data[0].nick,
					type: "quit",
				});
			}
		});
		break;
	
	case "topic":
		var chan = channels.findWhere({name: data[0].channel});
		var from = data[0].nick || chan.get("name");
		chan.get("messages").add({
			from: from,
			text: data[0].topic,
			type: "topic",
		});
		break;
	
	case "welcome":
		channels.first().get("messages").add([
			{text: "You're now connected to " + this.get("host")},
			{text: "You're now known as " + data[0]}
		]);
		break;
	
	case "whois":
		if (data[1] == null) {
			channels.first().get("messages").add({
				type: "error",
				text: data[0]
			});
			break;
		}
		var name = data[1].nickname;
		var chan = channels.findWhere({name: name}) || channels.add({type: "query", name: name});
		var i = 0;
		for (var k in data[1]) {
			if (i++ == 5) break;
			chan.get("messages").add({
				text: k + ": " + data[1][k]
			});
		}
		break;
	
	}
}
