"use strict";

const socket = require("../socket");
const store = require("../store").default;

socket.on("names", function(data) {
	const channel = store.getters.findChannel(data.id);

	if (channel) {
		channel.channel.users = data.users;
	}
});
