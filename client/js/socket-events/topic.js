"use strict";

const socket = require("../socket");
const {findChannel} = require("../vue");

socket.on("topic", function(data) {
	let channel = findChannel(data.chan);

	if (channel) {
		channel.channel.topic = data.topic;
	}
});
