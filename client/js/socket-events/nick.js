"use strict";

const socket = require("../socket");
const {vueApp} = require("../vue");

socket.on("nick", function(data) {
	const network = vueApp.networks.find((n) => n.uuid === data.network);

	if (network) {
		network.nick = data.nick;
	}
});
