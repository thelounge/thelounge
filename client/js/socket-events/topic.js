"use strict";

const socket = require("../socket");
const {findChannel} = require("../vue");

socket.on("topic", function(data) {
	const channel = findChannel(data.chan);

	if (channel) {
		channel.channel.topic = data.topic;
	}
});
