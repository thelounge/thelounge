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
		self.networks.on(
			"all",
			function() {
				self.sockets.emit("event", self.networks);
			}
		);
		socket.emit(
			"event",
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

	case "CONNECT":
		if (!argv[1]) {
			return;
		}
		var network = this.networks.add(new models.Network({
			host: argv[1]
		}));
		network.irc.addListener(
			"raw", 
			function() {
				handleEvent.apply(network, arguments);
			}
		);
		break;

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
	var network = this;
	network.get("channels").at(0).get("messages").add(
		new models.Message({
			user: argv.args[0],
			text: argv.args[1]
		})
	);
}
