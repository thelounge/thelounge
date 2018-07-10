"use strict";

const socket = require("../socket");
const utils = require("../utils");
const {vueApp, findChannel} = require("../vue");

// Sync unread badge and marker when other clients open a channel
socket.on("open", function(id) {
	if (id < 1) {
		return;
	}

	// Don't do anything if the channel is active on this client
	if (vueApp.activeChannel && vueApp.activeChannel.channel.id === id) {
		return;
	}

	// Clear the unread badge
	const channel = findChannel(id);

	if (channel) {
		channel.channel.highlight = 0;
		channel.channel.unread = 0;
		channel.channel.firstUnread = channel.channel.messages[channel.channel.messages.length - 1].id;
	}

	utils.updateTitle();
});
