var connect = require("connect");
var _  = require("lodash");
var io = require("socket.io");

// Local library
var models = require("./models");

var sockets;
var networks = new models.Networks;

module.exports = function server(options) {
	var app = connect().use(connect.static("client")).listen(9000);
	sockets = io.listen(app, {log: 0}).sockets;
	sockets.on("connection", function(s) {
		init(s);
	});
	
	networks.on("all", function(e) {
		sockets.emit("networks", networks);
	});
};

function init(socket) {
	socket.on("input", function(json) { clientInput(json); });
	sockets.emit("networks", networks);	
}

function clientInput(json) {
	var target = networks.find(json.id);
	if (!target) {
		return;
	}

	var network = target.network;
	var channel = target.channel;
	
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
		var m = new models.Message({text: _.tail(args, 2)});
		channel.get("messages").add(m);
		break;
	
	case "server":
	case "connect":
		if (!args[1]) {
			break;
		}
		
		var n = new models.Network({host: args[1]});
		networks.add(n);
		break;
	
	case "quit":
	case "disconnect":
		networks.remove(network);
		break;
	
	}
}