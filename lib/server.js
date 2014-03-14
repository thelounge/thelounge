var connect = require("connect");
var io = require("socket.io");

// Local libraries
var config = require("./../config.js");
var models = require("./models.js");

module.exports = Server;

function Server() {
	this.sockets = false;
	this.networks = new models.NetworkCollection;
}

Server.prototype.listen = function(port) {
	var self = this;
	var http = connect()
		.use(connect.static("client"))
		.listen(port);

	this.networks.on("all", function(type, data) {
		if (type == "USERS" || type == "MESSAGES") {
			this.sockets.emit(type, data);
		} else {
			// Force a refresh on network and channel events.
			this.sockets.emit(
				"NETWORKS", self.networks
			);
		}
	}, this);

	this.sockets = io.listen(http, {log: false}).sockets;
	this.sockets.on("connection", function(socket) {
		socket.emit(
			"NETWORKS", self.networks
		);
		socket.on(
			"input",
			function(input) {
				handleInput.call(self, input);
			}
		);
	});

	if (config.autoConnect) {
		this.connect(config.host, config.channels);
	}

	return this;
};

Server.prototype.connect = function(host, channels) {
	var network = new models.Network({
		host: host
	});
	this.networks.add(network);
	network.connect(channels).addListener("raw", function() {
		handleEvent.apply(network, arguments);
	});
};

function handleInput(input) {
	var target = this.networks.find(input.id);
	if (!target) {
		return;
	}

	var network = target.network;
	var channel = target.channel;

	var argv = input.text.substr(1).split(" ");
	var cmd  = input.text.charAt(0) == "/" ? argv[0].toUpperCase()
		: "MESSAGE";

	switch (cmd) {

	case "MESSAGE":
		var irc = network.irc;
		if (typeof irc !== "undefined") {
			irc.say(target.channel.get("name"), input.text);
		}
		channel.get("messages").add(
			new models.Message({
				user: network.get("nick"),
				text: input.text
			})
		);
		break;

	case "SERVER":
	case "CONNECT":
		this.connect(argv[1]);
		break;

	case "QUIT":
	case "DISCONNECT":
		this.networks.remove(network);
		break;

	case "JOIN":
	case "PART":
		var irc = network.irc;
		if (typeof irc !== "undefined") {
			irc.send(cmd, argv[1] || target.channel.get("name"));
		}
		break;

	case "UNQUERY":
	case "LEAVE":
		var channel = target.channel;
		if (channel.get("name").charAt(0) == "#") {
			handleInput.call(this, {
				id: input.id,
				text: "/part"
			});
		} else if (channel.get("type") != "network") {
			network.get("channels").remove(
				channel
			);
		}
		break;

	case "NOTICE":
		var irc = network.irc;
		if (!argv[2] || typeof irc === "undefined") {
			break;
		}

		var user = argv[1];
		var text = argv.slice(2).join(" ");

		irc.notice(user, text);
		channel.get("messages").add(
			new models.Message({
				text: "Notice to " + user + ": " + text,
				type: "notice"
			})
		);
		break;

	case "QUERY":
		var irc = network.irc;
		if (!argv[1] || typeof irc === "undefined") {
			break;
		}

		var channels = network.get("channels");
		if (argv[1].charAt(0) != "#" && !channels.findWhere({name: argv[1]})) {
			channels.add(
				new models.Channel({
					name: argv[1]
				})
			);
		}
		break;

	case "TOPIC":
		var irc = network.irc;
		if (typeof irc === "undefined") {
			break;
		}

		var params = [
			"topic",
			channel.get("name")
		];
		if (argv[1]) {
			var text = argv.slice(1).join(" ");
			params.push(text);
		}
		irc.send.apply(
			irc,
			params
		);
		break;

	case "NICK":
		var irc = network.irc;
		if (typeof irc !== "undefined") {
			irc.send("NICK", argv[1] || config.nick);
		}
		break;

	case "KICK":
		var irc = network.irc;
		if (argv[1] && typeof irc !== "undefined") {
			irc.send(
				"KICK",
				target.channel.get("name"),
				argv[1]
			);
		}
		break;

	case "WHOIS":
		var irc = network.irc;
		if (typeof irc !== "undefined") {
			irc.send("WHOIS", argv[1] || target.channel.get("name"));
		}
		break;

	case "OP":
	case "DEOP":
	case "VOICE":
	case "DEVOICE":
	case "MODE":
		var irc = network.irc;
		if (!argv[1] && typeof irc === "undefined") {
			break;
		}

		var mode;
		var user;
		if (cmd != "MODE") {
			user = argv[1];
			mode = {
			     "OP": "+o",
			   "DEOP": "-o",
			  "VOICE": "+v",
			"DEVOICE": "-v"
			}[cmd];
		} else if (!argv[2]) {
			break;
		} else {
			mode = argv[1];
			user = argv[2];
		}

		irc.send(
			"MODE",
			target.channel.get("name"),
			mode,
			user
		);
		break;

	// This command is used for debugging purposes.
	// Send raw commands.
	case "SEND":
		var irc = network.irc;
		if (typeof irc !== "undefined") {
			irc.send.apply(irc, argv.splice(1));
		}
		break;

	default:
		channel.get("messages").add(
			new models.Message({
				text: "Unknown command: `/" + cmd + "`",
				type: "error"
			})
		);

	}
}

function handleEvent(argv) {
	var network = this;
	var channels = network.get("channels");

	var event = argv.commandType != "error" ? argv.command
		: "ERROR";

	switch (event) {

	case "PRIVMSG":
		var target = argv.args[0];
		if (target.charAt(0) != "#") {
			target = argv.nick;
		}

		var channel = channels.findWhere({name: target});
		var message = argv.args[1];

		if (typeof channel == "undefined") {
			channel = channels.add(
				new models.Channel({
					name: target
				})
			);
		}

		var mode;
		var user = channel.get("users").findWhere({name: argv.nick});
		if (typeof user !== "undefined") {
			mode = user.get("mode");
		}
		
		channel.get("messages").add(
			new models.Message({
				mode: mode,
				user: argv.nick,
				text: message
			})
		);
		break;

	case "NOTICE":
		var from = argv.nick ? argv.nick : "-!-";
		var message = new models.Message({
			user: from,
			text: "notice: " + argv.args[1],
			type: "notice"
		});

		channels.each(function(channel) {
			channel.get("messages").add(message);
		});
		break;

	case "JOIN":
		var channel = channels.findWhere({name: argv.args[0]});
		if (typeof channel === "undefined") {
			channel = channels.add(
				new models.Channel({
					name: argv.args[0]
				})
			);
		}

		var users = channel.get("users");
		var messages = channel.get("messages");

		if (argv.nick != network.get("nick")) {
			users.add(
				new models.User({
					name: argv.nick
				})
			);
		}

		messages.add(
			new models.Message({
				user: argv.nick,
				text: "join",
				type: "join"
			})
		);
		break;

	case "PART":
		var channel = channels.findWhere({name: argv.args[0]});
		if (argv.nick == network.get("nick")) {
			channels.remove(channel);
		} else {
			var users = channel.get("users");
			users.remove(
				users.findWhere({
					name: argv.nick
				})
			);
			
			var messages = channel.get("messages");
			messages.add(
				new models.Message({
					user: argv.nick,
					text: "part",
					type: "part"
				})
			);
		}
		break;

	case "NICK":
		var message = new models.Message({
			user: argv.nick,
			text: "changed name to " + argv.args[0],
			type: "nick"
		});

		channels.each(function(channel) {
			var user = channel.get("users").findWhere({name: argv.nick});
			if (typeof user !== "undefined") {
				user.set("name", argv.args[0]);
				channel.get("messages").add(message);
			}
		});

		if (argv.nick == network.get("nick")) {
			network.set("nick", argv.args[0]);
		}
		break;

	case "KICK":
		var channel = channels.findWhere({
			name: argv.args[0]
		});

		var users = channel.get("users");
		var messages = channel.get("messages");

		if (argv.args[1] == network.get("nick")) {
			users.reset();
		} else {
			users.remove(
				users.findWhere({
					name: argv.args[1]
				})
			);
		}

		messages.add(
			new models.Message({
				user: argv.args[1],
				text: "was kicked by " + argv.nick,
				type: "kick"
			})
		);
		break;

	case "QUIT":
		var message = new models.Message({
			user: argv.nick,
			text: "quit",
			type: "quit"
		});

		channels.each(function(channel) {
			var user = channel.get("users").findWhere({name: argv.nick});
			if (typeof user !== "undefined") {
				channel.get("users").remove(user);
				channel.get("messages").add(message);
			}
		});
		break;

	case "MODE":
		var channel = channels.findWhere({name: argv.args[0]});
		if (typeof channel === "undefined") {
			break;
		}
		
		var target = argv.args[2] || argv.args[0];
		var messages = channel.get("messages");
		messages.add(
			new models.Message({
				user: argv.nick,
				text: "sets mode: " + argv.args[1] + " " + target,
				type: "mode"
			})
		);

		var irc = network.irc;
		if (argv.args[2] && typeof irc !== "undefined") {
			irc.send(
				"NAMES",
				channel.get("name")
			);
		}
		break;

	case "TOPIC":
		var channel = channels.findWhere({name: argv.args[0]});
		var messages = channel.get("messages");

		messages.add(
			new models.Message({
				user: argv.nick,
				text: "changed topic to: " + argv.args[1],
				type: "topic"
			})
		);
		break;

	case "rpl_notopic":
	case "rpl_topic":
		var channel = channels.findWhere({name: argv.args[1]});
		if (typeof channel !== "undefined") {
			var messages = channel.get("messages");
			messages.add(
				new models.Message({
					text: "Topic for " + argv.args[1] + ": " + argv.args[2],
					type: "topic"
				})
			);
		}
		break;

	case "rpl_namreply":
		var channel = network.get("channels").findWhere({name: argv.args[2]});
		var users = channel.get("users");

		if (typeof channel === "undefined") {
			channel = channels.add(
				new models.Channel({
					name: argv.args[2]
				})
			);
		}

		if (typeof rpl_namreply === "undefined") {
			channel.get("users").reset({silent: true});
		}
		rpl_namreply = true;

		var names = argv.args[3].split(' ');
		for (var i in names) {
			users.add(
				new models.User({name: names[i]}), {
					silent: true
				}
			);
		}
		break;

	case "rpl_endofnames":
		var channel = channels.findWhere({name: argv.args[1]});
		var users = channel.get("users");
		
		delete rpl_namreply;
		users.trigger(
			"add", {}, users
		);
		break;

	case "001": // `registered`
		network.set("nick", argv.args[0]);
	case "rpl_motdstart":
	case "rpl_endofmotd":
	case "rpl_motd":
		channels.first().get("messages").add(
			new models.Message({
				user: "-!-",
				text: argv.args[1]
			})
		);
		break;

	case "rpl_whoisuser":
	case "rpl_whoischannels":
	case "rpl_whoisserver":
	case "rpl_endofwhois":
		var channel = channels.findWhere({name: argv.args[1]});
		var message = argv.args.slice(2).join(" ");

		if (typeof channel == "undefined") {
			channel = channels.add(
				new models.Channel({
					name: argv.args[1]
				})
			);
		}

		channel.get("messages").add(
			new models.Message({
				user: argv.args[1],
				text: message
			})
		);
		break;

	case "ERROR":
		var args = argv.args;
		channels.first().get("messages").add(
			new models.Message({
				text: args[args.length - 1],
				type: "error"
			})
		);
		break;

	}

	// Debug
	console.log(argv);
}
