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
			if ([
				"users",
				"messages"
			].indexOf(type) != -1) {
				self.sockets.emit(type, data);
			} else {
				self.sockets.emit("networks", self.networks);
			}
		}
	);

	var options = {
		log: false
	};
	this.sockets = io
		.listen(http, options)
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
		target.channel.get("messages").add(
			new models.Message({user: "user", text: input.text})
		);
		break;

	case "JOIN":
		var irc = target.network.irc;
		if (argv[1] && typeof irc !== "undefined") {
			irc.join(argv[1]);
		}
		break;

	case "PART":
		var irc = target.network.irc;
		if (argv[1] && typeof irc !== "undefined") {
			irc.part(argv[1]);
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

	// Temp
	var network_lobby = channels.first().get("messages");
	network_lobby.add(
		new models.Message({
			user: argv.args[0],
			text: argv.args[1]
		})
	);

	var event = argv.command;
	switch (event) {

	case "JOIN":
		if (argv.nick == network.get("nick")) {
			var channel = new models.Channel({
				name: argv.args[0]
			});
			channel.get("users").add(
				new models.User({
					name: network.get("nick")
				})
			)
			channels.add(
				channel
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
	}

	// Debug
	console.log(argv);
}
