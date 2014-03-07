var connect = require("connect");
var models  = require("./models.js");
var _   = require("lodash");
var irc = require("irc");
var io  = require("socket.io");

exports.listen = listen;

var sockets = false;;
var networks = [];

addToServer(
	"NETWORK",
	new models.Network({address: "Start"})
);

function listen(port) {
	var http = connect()
		.use(connect.static("client"))
		.listen(port);
	sockets = io
		.listen(http)
		.on("connection", initSocket)
		.sockets;
}

function initSocket(socket) {
	socket.on("input", handleUserInput);
	refresh();
}

function sendEvent(params) {
	if (sockets) {
		sockets.emit("event", new models.Event(params));
	}
}

function refresh() {
	sendEvent({action: "RENDER", type: "NETWORK", data: networks});
}

function addToServer(type, model, target) {
	switch (type) {
	
	case "NETWORK":
		var channel = new models.Channel({
			name: model.address,
			type: "network"
		});

		model.channels.push(channel);
		networks.push(model);

		refresh();
		break;
	
	case "CHANNEL":
		target.network.channels.push(model);
		refresh();
		break;

	case "MESSAGE":
		target.channel.messages
			.push(model);
		sendEvent({
			action: "RENDER",
			type: "MESSAGE",
			target: target.channel.id,
			data: model
		});
		break;

	}
}

function handleUserInput(input) {
	var id = input.id;
	var text = input.text;

	var args = text.substr(1).split(' ');
	var cmd = text.charAt(0) == "/" ? args[0].toUpperCase()
		: "MESSAGE";
	
	var target = getTarget(id);

	switch (cmd) {
	
	case "SERVER":
	case "CONNECT":
		addToServer(
			"NETWORK",
			new models.Network({address: args[1]})
		);
		break;
	
	case "JOIN":
		addToServer(
			"CHANNEL",
			new models.Channel({name: args[1]}),
			target
		);
		break;
	
	case "PART":
		target.network.channels = _.reject(target.network.channels, {id: id});
		refresh();
		break;

	case "MESSAGE":
		addToServer(
			"MESSAGE", 
			new models.Message({text: input.text}),
			getTarget(id)
		);
		break;

	}
}

function getTarget(id) {
	var find;
	_.each(networks, function(n) {
		find = {network: n, channel: _.findWhere(n.channels, {id: id})};
		if (find.channel)
			return;
	});
	if (find.channel) {
		return new models.Target(find);
	}
}
