var _ = require("lodash");
var net = require("net");
var Helper = require("./helper");

function Identd() {
	// used to store who is connecting...
	this.connections = [];
	this.server = null;
	this.config = {
		enabled: false,
		port: 30113,
		default: "shout"
	};
};

Identd.prototype.respond = function(remoteIp, localPort, remotePort) {
	// Build the first part (always the same)
	var response = localPort + ", " + remotePort + " : ";
	var connection = _.where(this.connections, {"remoteIp": remoteIp, "remotePort": remotePort, "localPort": localPort});

	if (connection.length > 0) {
		// We have some connections, but we only want the first
		connection = _.first(connection);
		response += " USERID : UNIX : " + connection.username;
		// We're done with that connection. Remove it
		this.removeConnection(connection);
	} else {
		response += " ERROR : NOUSER";
	}
	// responses must end with CR+LF
	return response + "\r\n";
};

Identd.prototype.parse = function(request) {
	// myPort, theirPort\r\n
	request = request.split(/,\s*/);
	if (request.length == 2) {
		var localPort = parseInt(request[0]),
			remotePort = parseInt(request[1]);
	}
	return [localPort, remotePort];
};

Identd.prototype.start = function(config) {
	_.merge(this.config, config.identd);

	if (this.config.enabled) {
		var self = this;

		// create the server
		this.server = net.createServer(function(socket) {
			socket.on('data', function(data) {
				var parsed = this.parse(data);
				// parse and generate a response
				var response = this.respond(socket.remoteAddress, parsed[0], parsed[1]);
				socket.write(response);
				socket.end();
			});
		});
		console.log("Starting identd on " + this.config.port);
		this.server.listen(this.config.port);
	}

	return self;
};

Identd.prototype.addConnection = function(connection) {
	if (this.config.enabled)
		this.connections.push(connection);
};

Identd.prototype.removeConnection = function(connection) {
	if (this.config.enabled)
		this.connections = _.without(this.connections, connection);
};

module.exports = new Identd().start(Helper.getConfig());
