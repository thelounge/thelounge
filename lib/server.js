var connect = require("connect");
var io = require("socket.io");

// Local library
var models = require("./models.js");

module.exports = Server;

function Server() {
	this.sockets  = false;
	this.networks = new models.NetworkCollection;
}

Server.prototype.listen = function(port) {
	var self = this;
	var http = connect()
		.use(connect.static("client"))
		.listen(port);

	this.networks.on(
		"all",
		function(type, data) {
			if (type != "users" && type != "messages") {
				type = "networks";
				data = self.networks;
			}
			self.sockets
				.emit(type, data);
		}
	);

	this.sockets = io
		.listen(http, {log: false})
		.sockets;
	this.sockets.on("connection", function(socket) {
		socket.emit(
			"networks",
			self.networks
		);
		socket.on(
			"input",
			function(input) {
				handleInput.call(self, input);
			}
		);
	});

	return this;
};

function handleInput(input) {
	var target = this.networks.find(input.id);
	if (!target) {
		return;
	}

	var argv = input.text.substr(1).split(" ");
	var cmd  = input.text.charAt(0) == "/" ? argv[0].toUpperCase()
		: "";

	switch (cmd) {
	case "":
		var irc = target.network.irc;
		if (typeof irc !== "undefined") {
			var chan = target.channel.get("name");
			irc.say(chan, input.text);
		}
		target.channel.get("messages").add(
			new models.Message({
				user: target.network.get("nick"),
				text: input.text
			})
		);
		break;

	case "NOTICE":
		var irc = target.network.irc;
		if (argv[2] && typeof irc !== "undefined") {
			var user = argv[1];
			var text = argv
				.slice(2)
				.join(" ");

			irc.notice(user, text);
			target.channel.get("messages").add(
				new models.Message({
					user: target.network.get("nick"),
					text: "to " + user + ": " + text
				})
			);
		}
		break;

	case "QUERY":
		var irc = target.network.irc;
		if (argv[1] && typeof irc !== "undefined") {
			var channels = target.network.get("channels");
			if (argv[1].charAt(0) != "#" && !channels.findWhere({name: argv[1]})) {
				channels.add(
					new models.Channel({
						name: argv[1]
					})
				);
			}
		}
		break;

	case "JOIN":
		var irc = target.network.irc;
		if (argv[1] && typeof irc !== "undefined") {
			irc.join(argv[1]);
		}
		break;

	case "PART":
		var irc = target.network.irc;
		if (typeof irc !== "undefined") {
			irc.part(argv[1] ? argv[1] : target.channel.get("name"));
		}
		break;

	case "NAMES":
		var irc = target.network.irc;
		if (typeof irc !== "undefined") {
			var channel = argv[1] ? argv[1] : target.channel.get("name");
			irc.send("NAMES", channel);
		}
		break;

	case "NICK":
		var irc = target.network.irc;
		if (argv[1] && typeof irc !== "undefined") {
			irc.send("NICK", argv[1]);
		}
		break;

	case "TOPIC":
		var irc = target.network.irc;
		if (typeof irc !== "undefined") {
			if (!argv[1] || argv[1].charAt(0) != "#") {
				argv.splice(1, 0, target.channel.get("name"));
			}
			var topic = argv.slice(2).join(" ");
			irc.send.apply(
				irc,
				argv.length == 2 ? argv
					: argv.slice(0, 2).concat(topic)
			);
		}
		break;

	case "SERVER":
	case "CONNECT":
		if (argv[1]) {
			var network = this.networks.add(
				new models.Network({host: argv[1]})
			);
			network.irc.addListener(
				"raw",
				function() {
					handleEvent.apply(network, arguments);
				}
			);
		}
		break;

	case "QUIT":
	case "DISCONNECT":
		this.networks.remove(target.network);
		break;

	default:
		target.channel.get("messages").add(
			new models.Message({text: "Command `/" + cmd + "` does not exist."})
		);
		break;
	}
}

function handleEvent(argv) {
	var network  = this;
	var channels = network.get("channels");

	var event = argv.command;
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

		channel.get("messages").add(
			new models.Message({
				user: argv.nick,
				text: message
			})
		);
		break;

	case "NOTICE":
		var from = argv.nick ? argv.nick : argv.prefix;
		var message = new models.Message({
			user: from,
			text: "notice: " + argv.args[1]
		});
		channels.each(function(channel) {
			channel.get("messages").add(message);
		});
		break;

	case "JOIN":
		if (argv.nick == network.get("nick")) {
			channels.add(
				new models.Channel({
					name: argv.args[0]
				})
			);
		} else {
			var channel = channels.findWhere({name: argv.args[0]});
			var users   = channel.get("users");
			users.add(
				new models.User({
					name: argv.nick
				})
			);
			var messages = channel.get("messages");
			messages.add(
				new models.Message({
					user: argv.nick,
					text: "has joined the channel."
				})
			);
		}
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
					text: "has left the channel."
				})
			);
		}
		break;

	case "NICK":
		var message = new models.Message({
			user: argv.nick,
			text: "changed name to " + argv.args[0]
		});
		if (network.get("nick") == argv.nick) {
			network.set("nick", argv.nick);
		}
		channels.each(function(channel) {
			var user = channel.get("users").findWhere({name: argv.nick});
			if (typeof user !== "undefined") {
				user.set("name", argv.args[0]);
				channel.get("messages").add(message);
			}
		});
		break;

	case "TOPIC":
		var channel  = channels.findWhere({name: argv.args[0]});
		var messages = channel.get("messages");
		messages.add(
			new models.Message({
				user: argv.nick,
				text: "changed the topic of " + argv.args[0] + " to: "
					+ argv.args[1]
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
					text: "Topic for " + argv.args[1] + ": "
						+ argv.args[2]
				})
			);
		}
		break;

	case "rpl_namreply":
		var names   = argv.args[3].split(' ');
		var channel = network.get("channels").findWhere({name: argv.args[2]});
		var users   = channel.get("users");

		if (names[0] == network.get("nick")) {
			users.reset();
		}
		for (var i in names) {
			users.add(
				new models.User({name: names[i]}), {
					silent: true
				}
			);
		}
		break;

	case "rpl_endofnames":
		var channel = network.get("channels").findWhere({name: argv.args[1]});
		var users = channel.get("users");
		users.trigger(
			"add", {}, users
		);
		break;

	case "err_nicknameinuse":
	case "err_chanoprivsneeded":
	case "err_notonchannel":
	case "err_nosuchchannel":
	case "err_cannotsendtochan":
	case "err_nosuchnick":
		channels.first().get("messages").add(
			new models.Message({
				text: argv.args.slice(2).join(" ")
			})
		);
		break;

	default:
		channels.first().get("messages").add(
			new models.Message({
				user: "-!-",
				text: argv.args.slice(1).join(" ")
			})
		);
	}

	// Debug
	console.log(argv);
}
