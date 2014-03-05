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
	 * @private
	 */
	
	var sockets;

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
		var app = connect()
			.use(connect.static("client"))
			.listen(port);

		sockets =
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
		sockets.emit(
			"init",
			self.networks
		);
		socket.on(
			"input",
			function(input) {
				self.handleUserInput(input)
			}
		);
	};

	/**
	 * Handle incoming inputs sent from clients.
	 *
	 * @param {String} input
	 * @public
	 */

	this.handleUserInput = function(input) {
		var text = input.text;
		if (text.charAt(0) != "/") {
			console.log("MESSAGE: " + text);
			return;
		}
		
		var args = text.substr(1).split(" ");
		var cmd = args[0].toUpperCase();

		switch (cmd) {

		default:
			console.log("COMMAND: " + cmd);
			break;

		}
	};

};
