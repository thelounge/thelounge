/**
 * The Client class.
 *
 * @public
 */

function Client() {

	/**
	 * Self reference.
	 *
	 * @private
	 */
	
	var self = this;

	/**
	 * List of networks.
	 *
	 * @type {Array<Network>}
	 * @public
	 */

	this.networks = [];
	
	/**
	 * The active socket.
	 *
	 * @type {Socket}
	 * @public
	 */

	this.socket;

	/**
	 * Connect to the server via WebSockets and start listening
	 * to events sent by the server.
	 *
	 * @param {String} host
	 * @public
	 */
	
	this.connect = function(host) {
		this.socket = io.connect(host)
			.on("init", function(networks) { self.networks = networks; })
				.on("event", this.handleEvent);
	};

	/**
	 * Handle events sent by the server.
	 *
	 * @param {Event} event
	 * @public
	 */
	
	this.handleEvent = function(event) {
		// Debug
		console.log(event);
	};
};
