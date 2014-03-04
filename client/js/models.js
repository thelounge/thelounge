(function(exports) {
	
	/**
	 * Declare the namespaces.
	 *
	 * @namespace
	 */
	
	var models =
		typeof window === "undefined" ? exports
			: window.models = {};
	
	/**
	 * Network model.
	 *
	 * @public
	 */
	
	models.Network = function() {
		
		/**
		 * The network address.
		 *
		 * @type {String}
		 * @public
		 */

		this.address = "";

		/**
		 * List of channels.
		 *
		 * @type {Array<Channel>}
		 * @public
		 */

		this.channels = [];

	};

	/**
	 * Channel model.
	 *
	 * @public
	 */
	
	models.Channel = function() {
		
		/**
		 * The channel name.
		 *
		 * @type {String}
		 * @public
		 */

		this.name = "";

		/**
		 * The current channel topic.
		 *
		 * @type {String}
		 * @public
		 */

		this.topic = "";
		
		/**
		 * List of users.
		 *
		 * @type {Array<User>}
		 * @public
		 */

		this.users = [];

		/**
		 * List of messages.
		 *
		 * @type {Array<Message>}
		 * @public
		 */

		this.messages = [];

	};

	/**
	 * User model.
	 *
	 * @public
	 */
	
	models.User = function() {
		
		/**
		 * The user name.
		 *
		 * @type {String}
		 * @public
		 */

		this.name = "";

	};

	/**
	 * Message model.
	 *
	 * @public
	 */
	
	models.Message = function() {
		
		/**
		 * The timestamp.
		 *
		 * @type {String}
		 * @public
		 */

		this.time = "";

		/**
		 * The content of the message.
		 *
		 * @type {String}
		 * @public
		 */

		this.text = "";

		/**
		 * The author of the message.
		 *
		 * @type {String}
		 * @public
		 */

		 this.user = "";
	};

})(this);
