"use strict";

const $ = require("jquery");
const socket = require("../socket");

// Sync unread badge and marker when other clients open a channel
socket.on("open", function(id) {
	if (id < 1) {
		return;
	}

	const channel = $("#chat #chan-" + id);

	// Don't do anything if the channel is active on this client
	if (channel.length === 0 || channel.hasClass("active")) {
		return;
	}

	// Clear the unread badge
	$("#sidebar").find(".chan[data-id='" + id + "'] .badge")
		.removeClass("highlight")
		.empty();

	// Move unread marker to the bottom
	channel
		.find(".unread-marker")
		.data("unread-id", 0)
		.appendTo(channel.find(".messages"));
});
