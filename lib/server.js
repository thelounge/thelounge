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
	 * Self reference.
	 *
	 * @private
	 */
	
	var self = this;

	/**
	 * Active sockets managed by socket.io.
	 *
	 * @type {Object}
	 * @public
	 */
	
	this.sockets;

	/**
	 * List of networks.
	 *
	 * @type {Array<Network>}
	 * @public
	 */

	this.networks = [];

	/**
	 * Start the server and listen for connections
	 * on the specified port.
	 *
	 * @param {Int} port
	 * @public
	 */
	
	this.listen = function(port) {
		var app = connect().use(connect.static("client"))
			.listen(port);
		
		this.sockets =
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
		self.sockets.emit("init", self.networks);
		socket.on("input", self.handleUserInput);
	};

	/**
	 * Handle incoming inputs sent from clients.
	 *
	 * @param {String} input
	 * @public
	 */

	this.handleUserInput = function(input) {
		// Debug
		console.log(input);
	};
};
