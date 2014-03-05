(function(exports) {
	
	/**
	 * Declare the namespace.
	 *
	 * @namespace
	 */
	
	var models =
		typeof window === "undefined" ? exports
			: window.models = {};
	
	/**
	 * Use this to create unique identifiers.
	 *
	 * @type {Int}
	 * @private
	 */
	
	var id = 0;

	/**
	 * Network model.
	 *
	 * @public
	 */
	
	models.Network = function() {
		
		/**
		 * Unique identifier.
		 *
		 * @type {Int}
		 * @public
		 */

		this.id = id++;
		
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

		/**
		 * User nickname.
		 *
		 * @type {String}
		 * @public
		 */

		this.nick = "";

	};

	/**
	 * Channel model.
	 *
	 * @public
	 */
	
	models.Channel = function() {
		
		/**
		 * Unique identifier.
		 *
		 * @type {Int}
		 * @public
		 */

		this.id = id++;
		
		/**
		 * The channel name.
		 *
		 * @type {String}
		 * @public
		 */

		this.name = "";
		
		/**
		 * The channel type.
		 * This property should be either `network` or `channel`.
		 *
		 * @type {String}
		 * @public
		 */
		
		this.type = "channel";

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
		 * Unique identifier.
		 *
		 * @type {Int}
		 * @public
		 */

		this.id = id++;
		
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

	/**
	 * Event model.
	 *
	 * Used when pushing changes between the server
	 * and the clients.
	 *
	 * @public
	 */

	models.Event = function() {

		/**
		 * Action to perform.
		 *
		 * @type {String}
		 * @public
		 */

		this.action = "";

		/**
		 * Model type.
		 *
		 * @type {String}
		 * @public
		 */

		this.type = "";

		/**
		 * The target network or channel.
		 *
		 * @type {Int|String|Object}
		 * @public
		 */

		this.target = "";

		/**
		 * The data.
		 *
		 * @type {Int|String|Object}
		 * @public
		 */

		this.data = "";

	};

})(this);
