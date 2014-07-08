var _ = require("lodash");
var Client = require("./client");
var config = require("../config") || {};
var http = require("connect");
var io = require("socket.io");

var sockets = null;
var clients = [];

var inputs = [
	"action",
	"connect",
	"invite",
	"join",
	"kick",
	"mode",
	"msg",
	"nick",
	"notice",
	"part",
	"quit",
	"raw",
	"topic",
	"whois"
];

module.exports = function() {
	sockets = io(http().use(http.static("client")).listen(config.port || 9000));
	sockets.on("connect", function(socket) {
		if (config.public) {
			auth.call(socket);
		} else {
			init(socket);
		}
	});
};

function init(socket, client) {
	if (!client) {
		socket.emit("auth");
		socket.on("auth", auth);
	} else {
		socket.on(
			"input",
			function(data) {
				input(client, data);
			}
		);
		socket.on(
			"conn",
			function(data) {
				client.connect(data);
			}
		);
		socket.join(client.id);
		socket.emit("init", {
			networks: client.networks
		});
	}
}

function auth(data) {
	var socket = this;
	if (config.public) {
		var client = new Client(sockets);
		clients.push(client);
		socket.on("disconnect", function() {
			clients = _.without(clients, client);
			client.quit();
		});
		init(socket, client);
	} else {
		if (false) {
			// ..
		}
	}
}

function input(client, data) {
	var target = client.find(data.target);

	var text = data.text;
	if (text.charAt(0) !== "/") {
		text = "/say " + text;
	}
	
	var args = text.split(" ");
	var cmd = args.shift().replace("/", "").toLowerCase();
	
	inputs.forEach(function(plugin) {
		try {
			var fn = require("./plugins/inputs/" + plugin);
			fn.apply(client, [
				target.network,
				target.chan,
				cmd,
				args
			]);
		} catch (err) {
			// ..
		}
	});
}
