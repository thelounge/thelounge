"use strict";

const socket = require("../socket");
const {findNetwork} = require("../vue");

socket.on("nick", function(data) {
	const network = findNetwork(data.network);

	if (network) {
		network.nick = data.nick;
	}
});
