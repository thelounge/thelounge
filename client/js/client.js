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
	 * The sidebar view.
	 *
	 * @type {Sidebar}
	 * @private
	 */
	
	var sidebar = new views.Sidebar();

	/**
	 * The chat view.
	 *
	 * @type {Chat}
	 * @private
	 */
	
	var chat = new views.Chat();

	/**
	 * The active socket.
	 *
	 * @type {Socket}
	 * @public
	 */
	
	this.socket;

	/**
	 * List of networks.
	 *
	 * @type {Array<Network>}
	 * @public
	 */

	this.networks = [];

	/**
	 * Initialize new socket connections.
	 *
	 * @param {Array<Network>}
	 * @public
	 */
	
	this.init = function(networks) {
		this.networks = networks;
		this.socket.on("event", self.handleEvent);
		chat.render(this.networks);
		sidebar.render(this.networks);
	};

	/**
	 * Connect to the server via WebSockets and start listening
	 * for the `init` event.
	 *
	 * @param {String} host
	 * @public
	 */
	
	this.connect = function(host) {
		this.socket = io.connect(host).on("init", self.init)
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

/**
 * Views namespace.
 *
 * @namespace
 */

var views = {};

/**
 * Sidebar view.
 *
 * @public
 */

views.Sidebar = function() {
	
	/**
	 * Template container.
	 *
	 * @private
	 */
	
	var tpl = {
		networks: $("#networks").html()
	};

	/**
	 * Render the view.
	 *
	 * @param {Array<Network>} networks
	 * @public
	 */
	
	this.render = function(networks) {
		$("#sidebar").html(Mustache.render(tpl.networks, {networks: networks}));
	};
	
};

/**
 * Chat view.
 *
 * @public
 */

views.Chat = function() {

	/**
	 * Template container.
	 *
	 * @private
	 */
	
	var tpl = {
		channels: $("#channels").html()
	};
	
	/**
	 * Partial templates.
	 *
	 * @private
	 */
	
	var partials = {
		users: $("#users").html(),
		messages: $("#messages").html()
	};

	/**
	 * This is the target element where we will
	 * render the view.
	 *
	 * @type {jQuery.Object}
	 * @public
	 */
	
	this.element = $("#chat");
	
	/**
	 * Render the view.
	 *
	 * @param {Array<Network>} networks
	 * @public
	 */
	
	this.render = function(networks) {
		var render = "";
		networks.forEach(function(n) {
			render += Mustache.render(tpl.channels, n, partials);
		});
		this.element
			.html(render);
	};

	/**
	 * Add to view.
	 *
	 * @param {Event} event
	 * @public
	 */
	
	this.add = function(event) {
		var render = "";
		var target = "";

		switch(event.type) {
		
		case "channel":
			render = Mustache.render(
				tpl.channels, {channels: event.data}
			);
			break;

		case "message":
			target = ".messages";
			render = Mustache.render(
				partials.messages, {messages: event.data}
			);
			break;

		case "user":
			target = ".users";
			render = Mustache.render(
				partials.users, {users: event.data}
			);
			break;

		}
		
		if (target == "") {
			this.element
				.append(render);
		} else {
			this.element
				.find("[data-id='" + event.target + "'] " + target)
				.append(render);
		}
	};

	/**
	 * Remove from view.
	 *
	 * @param {Int} id
	 * @public
	 */
	
	this.remove = function(id) {
		this.element.find("[data-id='" + id + "']").remove();
	};
};
