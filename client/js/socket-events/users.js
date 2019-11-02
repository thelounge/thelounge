"use strict";

const socket = require("../socket");
const {findChannel} = require("../vue");
const store = require("../store").default;

socket.on("users", function(data) {
	if (store.state.activeChannel && store.state.activeChannel.channel.id === data.chan) {
		return socket.emit("names", {
			target: data.chan,
		});
	}

	const channel = findChannel(data.chan);

	if (channel) {
		channel.channel.usersOutdated = true;
	}
});
