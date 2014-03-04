/**
 * The Client class
 *
 * @public
 */

function Client() {

	/**
	 * Self references.
	 *
	 * @private
	 */
	
	var self = this;
	
	/**
	 * The active socket.
	 *
	 * @private
	 */
	
	var socket = io.connect("")
		.on("init", function(data) { self.init(data); });

	/**
	 * Set up new socket connections.
	 *
	 * @param {String} data
	 * @public
	 */
	
	this.init = function(data) {
		// Debug
		console.log(data);
	};

};
