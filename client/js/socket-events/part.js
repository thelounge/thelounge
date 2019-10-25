"use strict";

const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("part", function(data) {
	// When parting from the active channel/query, jump to the network's lobby
	if (vueApp.activeChannel && vueApp.activeChannel.channel.id === data.chan) {
		vueApp.$router.push("chan-" + vueApp.activeChannel.network.id);
	}

	const channel = findChannel(data.chan);

	if (channel) {
		channel.network.channels.splice(
			channel.network.channels.findIndex((c) => c.id === data.chan),
			1
		);
	}

	vueApp.synchronizeNotifiedState();
});
