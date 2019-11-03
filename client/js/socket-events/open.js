"use strict";

const socket = require("../socket");
const {vueApp} = require("../vue");
const store = require("../store").default;

// Sync unread badge and marker when other clients open a channel
socket.on("open", function(id) {
	if (id < 1) {
		return;
	}

	// Don't do anything if the channel is active on this client
	if (store.state.activeChannel && store.state.activeChannel.channel.id === id) {
		return;
	}

	// Clear the unread badge
	const channel = store.getters.findChannel(id);

	if (channel) {
		channel.channel.highlight = 0;
		channel.channel.unread = 0;

		if (channel.channel.messages.length > 0) {
			channel.channel.firstUnread =
				channel.channel.messages[channel.channel.messages.length - 1].id;
		}
	}

	vueApp.synchronizeNotifiedState();
});
