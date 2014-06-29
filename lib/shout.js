var _ = require("lodash");
var Client = require("./models/client");
var config = require("../config") || {};
var http = require("connect");
var io = require("socket.io");

var sockets = null;
var clients = [];

var inputs = [
	"action",
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
	"server",
	"topic",
	"whois"
];

var events = [
	"errors",
	"join",
	"kick",
	"mode",
	"motd",
	"message",
	"names",
	"nick",
	"notice",
	"part",
	"quit",
	"topic",
	"welcome",
	"whois"
];

module.exports = function() {
	sockets = io(http().use(http.static("client")).listen(config.port || 9000));
	sockets.on("connection", function(socket) {
		if (config.public) {
			init(socket, new Client());
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
		socket.on("input", function(data) { input(client, data); });
		socket.join(client.id);
		socket.emit("init", {
			networks: client.networks
		});
	}
};

function auth() {
	var socket = this;
};
