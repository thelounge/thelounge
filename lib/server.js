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
		sockets.emit("network", networks);
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
	
	networks.trigger("network", networks);
	
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
		channel.addMessage({
			from: user,
			message: message,
		});
		break;
	
	case "server":
	case "connect":
		if (args[1]) {
			connect({host: args[1]});
		}
		break;
	
	case "join":
	case "part":
	case "nick":
		if (client && args[1]) {
			client[cmd].apply(client, args.slice(1));
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
	
	case "mode":
		break;
	
	case "quit":
	case "disconnect":
		networks.remove(network);
		networks.trigger("network", networks);
		break;
	
	}
}

function event(event, data) {
	var channels = this.get("channels");
	
	switch (event) {
	
	case "join":
		var chan = channels.findWhere({name: data[0].channel}) || channels.add({name: data[0].channel});
		chan.addUser({name: data[0].nick});
		chan.addMessage({
			from: data[0].nick,
			type: "join",
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
		chan.addMessage({
			from: data[0].nick,
			type: "part",
		});
		break;
	
	case "kick":
		var chan = channels.findWhere({name: data[0].channel});
		var users = chan.get("users");
		
		if (data[0].client == this.get("client").me) {
			users.reset();
		} else {
			users.remove(
				users.findWhere({name: data[0].client})
			);
		}
		
		chan.addMessage({
			from: data[0].nick,
			message: data[0].client,
			type: "kick",
		});
		break;
	
	case "motd":
		var messages = data[0].motd;
		messages.forEach(function(msg) {
			channels.first().addMessage({message: msg});
		});
		break;
	
	case "message":
		var chan = channels.findWhere({name: data[0].to}) || channels.add({type: "query", name: data[0].from});
		chan.addMessage({
			from: data[0].from,
			message: data[0].message
		});
		break;
	
	case "names":
		var chan = channels.findWhere({name: data[0].channel});
		chan.get("users").reset(
			_.map(data[0].names, function(n) {
				return {name: n};
			})
		);
		break;
	
	case "nick":
		if (data[0].new == this.get("client").me) {
			channels.first().addMessage({
				message: "You're now known as " + data[0]["new"],
			});
		}
		channels.each(function(chan) {
			var users = chan.get("users");
			var user = users.findWhere({name: data[0].nick});
			if (!user) {
				return;
			}
			
			user.set("name", data[0]["new"]);
			users.trigger("change", {}, users);
			
			chan.addMessage({
				from: data[0].nick,
				message: data[0]["new"],
				type: "nick",
			});
		});
		break;
	
	case "notice":
		if (data[0].to = "*") {
			data[0].from = "-!-";
		}
		channels.first().addMessage(data[0]);
		break;
	
	case "quit":
		channels.each(function(chan) {
			var users = chan.get("users");
			var user = users.findWhere({name: data[0].nick});
			if (user) {
				users.remove(user);
				chan.addMessage({
					from: data[0].nick,
					type: "quit",
				});
			}
		});
		break;
	
	case "topic":
		var chan = channels.findWhere({name: data[0].channel});
		var from = data[0].nick || chan.get("name");
		chan.addMessage({
			from: from,
			message: data[0].topic,
			type: "topic",
		});
		break;
	
	case "welcome":
		channels.first().addMessage([
			{message: "You're now connected to " + this.get("host")},
			{message: "You're now known as " + data[0]}
		]);
		break;
	
	case "whois":
		if (data[1] == null) {
			channels.first().addMessage({
				type: "error",
				message: data[0]
			});
			break;
		}
		
		var name = data[1].nickname;
		var chan = channels.findWhere({name: name}) || channels.add({type: "query", name: name});
		
		var i = 0;
		for (var k in data[1]) {
			if (i++ == 5) break;
			chan.addMessage({
				message: k + ": " + data[1][k]
			});
		}
		break;
	
	}
	
	// Debug
	console.log(event);
	console.log(data);
}
