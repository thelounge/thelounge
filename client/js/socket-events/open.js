"use strict";

const $ = require("jquery");
const socket = require("../socket");

socket.on("open", function(id) {
	// Another client opened the channel, clear the unread counter
	$("#sidebar").find(".chan[data-id='" + id + "'] .badge")
		.removeClass("highlight")
		.empty();
});
