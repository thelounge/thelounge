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
	sockets.emit("event", _.assign(new models.Event, {
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
	switch (args[0]) {
	case "connect":
		if (typeof args[1] !== "undefined") {
			addNetwork(args[1], true);
		}
		break;

	case "join":
		if (typeof args[1] === "undefined") {
			return;
		}
		target.network.channels.push(
			_.assign(new models.Channel, {
				name: args[1]
			})
		);
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

	var chan = _.assign(new models.Channel, {name: addr, type: "network"});
	var network = _.assign(
		new models.Network, {channels: [chan]}
	);

	if (bool) {
		network.irc = new irc.Client(addr, "default_user", {
			channels: ["#default_channel"]
		});
		network.irc.addListener("raw", function() {
			handleEvent.apply(this, [network].concat(arguments));
		});
	}

	networks.push(network);
	refresh();
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
	var message = _.assign(new models.Message, {text: text});
	target.channel.messages.push(message);
	sockets.emit("event", _.assign(new models.Event, {
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
