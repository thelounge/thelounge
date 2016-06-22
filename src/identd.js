var _ = require("lodash");
var net = require("net");

var users = {};
var enabled = false;

module.exports.start = function(port) {
	port = port || 113;
	log.info("Starting identd server on port", port);
	net.createServer(init).listen(port);
	enabled = true;
};

module.exports.hook = function(stream, user) {
	var socket = stream.socket || stream;
	var ports = _.pick(socket, "localPort", "remotePort");
	var id = _.values(ports).join(", ");

	users[id] = user;

	socket.on("close", function() {
		delete users[id];
	});
};

module.exports.isEnabled = function() {
	return enabled;
};

function init(socket) {
	socket.on("data", function(data) {
		respond(socket, data);
	});
}

function respond(socket, data) {
	var id = parse(data);
	var response = id + " : ";
	if (users[id]) {
		response += "USERID : UNIX : " + users[id];
	} else {
		response += "ERROR : NO-USER";
	}
	response += "\r\n";
	socket.write(response);
	socket.end();
}

function parse(data) {
	data = data.toString();
	data = data.split(",");
	return parseInt(data[0]) + ", " + parseInt(data[1]);
}
