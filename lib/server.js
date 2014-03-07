var connect = require("connect");
var io  = require("socket.io");

// Local library
var models  = require("./models.js");

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
		init.call(self, socket);
	});

	return this;
};

function init(socket) {
	socket.emit(
		"event",
		this.networks
	)
}
