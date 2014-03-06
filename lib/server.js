var _ = require("lodash");
var connect = require("connect");
var io = require("socket.io");
var models = require("./models.js");

exports.listen = listen;

var sockets;
var networks = [];

var network = new models.Network;
var chan = _.assign(new models.Channel, {
	name: "Network",
	type: "network"
});

network.channels.push(chan);
networks.push(network);

function listen(port) {
	var http = connect()
		.use(connect.static("client"))
		.listen(port);
	sockets = io.listen(http).sockets;
	sockets.on("connection", function(socket) {
		init(socket);
	});
};

function init(socket) {
	socket.on(
		"input",
		function(input) {
			handleUserInput(input)
		}
	);
	sockets.emit("event", _.assign(new models.Event, {
		action: "redraw",
		data: networks
	}));
};

function handleUserInput(input) {
	var id = input.id;
	var text = input.text;
	
	var message = _.assign(new models.Message, {text: text});
	var event = _.assign(new models.Event, {
		action: "add",
		type: "message",
		data: message,
		target: id
	});

	sockets.emit("event", event);

	_.each(networks, function(n) {
		var chan = _.findWhere(n.channels, {id: id});
		if (chan !== "undefined") {
			chan.messages.push(message);
		}
	});
};
