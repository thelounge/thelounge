"use strict";

const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("users", function(data) {
	if (vueApp.activeChannel && vueApp.activeChannel.channel.id === data.chan) {
		return socket.emit("names", {
			target: data.chan,
		});
	}

	const channel = findChannel(data.chan);

	if (channel) {
		channel.channel.usersOutdated = true;
	}
});
