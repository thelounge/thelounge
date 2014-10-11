var _ = require("lodash");
var net = require("net");
var Helper = require("./helper");

function Identd() {
	// used to store who is connecting...
	this.connections = [];
	this.server = null;
	this.config = {
		enable: false,
		port: 30113,
		default: "shout"
	};
};

Identd.prototype.respond = function(remoteIp, localPort, remotePort) {
	// Build the first part (always the same)
	var response = localPort + ", " + remotePort + " : ";
	var params = {"remoteIp": remoteIp, "remotePort": remotePort, "localPort": localPort};
	var connection = _.where(this.connections, params);
	if (connection.length == 0) {
		params["localPort"] = undefined;
		connection = _.where(this.connections, params);
	}

	if (connection.length > 0) {
		// We have some connections, but we only want the first
		connection = _.first(connection);
		response += " USERID : UNIX : " + connection.username;
		// We're done with that connection. Remove it
		this.removeConnection(connection);
	} else {
		if (this.config.default == null) {
			response += " ERROR : NOUSER";
		} else {
			var ident = this.config.default.replace(/\?/g, function(a) {
				return Math.floor(Math.random() * 10);
			});
			response += " USERID : UNIX : " + ident;
		}
	}
	// responses must end with CR+LF
	return response + "\r\n";
};

Identd.prototype.parse = function(request) {
	// myPort, theirPort\r\n
	request = request.toString().split(/,\s*/);
	if (request.length == 2) {
		var localPort = parseInt(request[0]),
			remotePort = parseInt(request[1]);
	}
	return [localPort, remotePort];
};

Identd.prototype.start = function(config) {
	_.merge(this.config, config.identd);
	
	if (this.config.enable) {
		var self = this;

		// create the server
		this.server = net.createServer(function(socket) {
			socket.on('data', function(data) {
				var parsed = self.parse(data);
				// parse and generate a response
				var response = self.respond(socket.remoteAddress, parsed[0], parsed[1]);
				socket.write(response);
				socket.end();
			});
		});
		log("Starting identd on " + this.config.port);
		this.server.listen(this.config.port);
	}

	return self;
};

Identd.prototype.addConnection = function(connection) {
	if (this.config.enable) {
		this.connections.push(connection);
		log("Identd: adding:", connection);
	}
};

Identd.prototype.removeConnection = function(connection) {
	if (this.config.enable) {
		this.connections = _.without(this.connections, connection);
		log("Identd: removing:", connection);
	}
};

module.exports = new Identd();
