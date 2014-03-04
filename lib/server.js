/**
 * Module dependencies.
 */

var connect = require("connect");
var io = require("socket.io");

// Local library.
var models = require("../client/js/models.js");

/**
 * Export module.
 */

module.exports = Server;

/**
 * The Server class.
 *
 * @public
 */

function Server() {

	/**
	 * Active sockets.
	 *
	 * @private
	 */
	
	var sockets;
	
	/**
	 * Start the server and listen to the specified port.
	 *
	 * @param {Int} port
	 * @public
	 */
	
	this.listen = function(port) {
		var app = connect().use(connect.static("client"))
			.listen(port);
		
		var sockets = 
			io.listen(app).on("connection", this.init)
				.sockets;
	};

	/**
	 * Initiate new socket connections.
	 *
	 * @param {Socket} socket
	 * @public
	 */
	
	this.init = function(socket) {
		// ..
	};

};
