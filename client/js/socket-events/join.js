"use strict";

const socket = require("../socket");
const {vueApp, initChannel} = require("../vue");
const store = require("../store").default;

socket.on("join", function(data) {
	initChannel(data.chan);

	const network = store.getters.findNetwork(data.network);

	if (!network) {
		return;
	}

	network.channels.splice(data.index || -1, 0, data.chan);

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	vueApp.switchToChannel(store.getters.findChannel(data.chan.id).channel);
});
