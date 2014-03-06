var _ = require("lodash");
var connect = require("connect");
var irc = require("irc");
var io = require("socket.io");
var models = require("./models.js");

exports.listen = listen;

var sockets;
var networks = [];

addNetwork("Lobby", false);

function listen(port) {
	var http = connect()
		.use(connect.static("client"))
		.listen(port);
	sockets = io.listen(http).sockets;
	sockets.on("connection", function(socket) {
		init(socket);
	});
}

function init(socket) {
	refresh();
	socket.on(
		"input",
		function(input) {
			handleUserInput(input)
		}
	);
}

function refresh() {
	if (typeof sockets === "undefined") {
		return;
	}
	sockets.emit("event", new models.Event({
		action: "refresh",
		data: networks
	}));
}

function handleUserInput(input) {
	var text = input.text;
	var target = getChannel(input.id);
	
	if (text.charAt(0) != "/") {
		return addMessage(target, text);
	} 

	var args = text.substr(1).split(" ");
	var cmd = args[0].toUpperCase();

	switch (cmd) {

	case "SERVER":
	case "CONNECT":
		if (args[1]) {
			addNetwork(args[1], true);
		}
		break;

	case "JOIN":
		if (args[1]) {
			target.network.channels.push(
				new models.Channel({
					name: args[1]
				})
			);
			refresh();
		}
		break;
	
	case "PART":
		target.network.channels =
			_.without(target.network.channels, target.channel);
		refresh();
		break;

	default:
		addMessage(
			target,
			"Command '/" + args[0] + "' does not exist."
		);
		break;
	
	}
}

function addNetwork(addr, bool) {
	bool = bool || false;

	var chan = new models.Channel({
		name: addr,
		type: "network"
	});
	var network = new models.Network({
		channels: [chan]
	});

	networks.push(network);
	refresh();

	if (addr == "Lobby") {
		return;
	}

	network.client = new irc.Client(addr, "default_user");
	network.client.addListener("raw", function() {
		handleEvent(
			network, arguments
		);
	});
}

function handleEvent(network) {
	var args = arguments;
	var target = {
		network: network,
		channel: network.channels[0]
	};

	console.log(args[1]);
	addMessage(target, args[1][0].args);
}

function addMessage(target, text) {
	var message = _.extend(new models.Message, {text: text});
	target.channel.messages.push(message);
	sockets.emit("event", new models.Event({
		action: "add",
		type: "message",
		target: target.channel.id,
		data: message
	}));
}

function getChannel(id) {
	for (var i = 0; i < networks.length; i++) {
		var find = {
			network: networks[i],
			channel: _.findWhere(networks[i].channels, {id: id})
		};
		if (typeof find.channel !== "undefined") {
			return find;
		}
	}
}
