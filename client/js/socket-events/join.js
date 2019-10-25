"use strict";

const socket = require("../socket");
const {vueApp, initChannel} = require("../vue");

socket.on("join", function(data) {
	initChannel(data.chan);

	vueApp.networks
		.find((n) => n.uuid === data.network)
		.channels.splice(data.index || -1, 0, data.chan);

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	vueApp.$router.push("chan-" + data.chan.id);
});
