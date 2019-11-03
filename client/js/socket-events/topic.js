"use strict";

const socket = require("../socket");
const store = require("../store").default;

socket.on("topic", function(data) {
	const channel = store.getters.findChannel(data.chan);

	if (channel) {
		channel.channel.topic = data.topic;
	}
});
