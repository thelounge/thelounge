"use strict";

import socket from "../socket";
import store from "../store";

socket.on("nick", function (data) {
	const network = store.getters.findNetwork(data.network);

	if (network) {
		network.nick = data.nick;
	}
});
