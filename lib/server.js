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
	
	this.sockets = io.listen(http).sockets;
	this.sockets.on("connection", function(socket) {
		socket.emit(
			"event",
			self.networks
		);
		socket.on(
			"input",
			function(input) {
				handleUserInput.call(self, input);
			}
		);
	});

	return this;
};

function handleUserInput(input) {
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

	case "CONNECT":
		var network = new models.Network({
			host: "irc.freenode.org",
			connect: true
		});
		this.networks.add(network);
		var messages = network.get("channels").at(0).get("messages");
		messages.add(
			new models.Message({text: "Connecting..."})
		);

		var self = this;
		network.conn.addListener("raw", function(argv) {
			messages.add(
				new models.Message({user: argv.args[0], text: argv.args[1]})
			);
			self.sockets.emit(
				"event",
				self.networks
			);
		});
		break;

	default:
		target.channel.get("messages").add(
			new models.Message({text: "Command `/" + cmd + "` does not exist."})
		);
		break;

	}

	this.sockets.emit(
		"event",
		this.networks
	);
}
