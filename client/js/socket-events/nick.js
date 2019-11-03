"use strict";

const socket = require("../socket");
const store = require("../store").default;

socket.on("nick", function(data) {
	const network = store.getters.findNetwork(data.network);

	if (network) {
		network.nick = data.nick;
	}
});
