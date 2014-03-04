/**
 * Module dependencies.
 */

var connect = require("connect");

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
	 * Start the server.
	 *
	 * @public
	 */
	
	this.listen = function(port) {
		connect().use(connect.static("client")).listen(port);
	};
};
