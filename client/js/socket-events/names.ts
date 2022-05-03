"use strict";

import socket from "../socket";
import store from "../store";

socket.on("names", function (data) {
	const channel = store.getters.findChannel(data.id);

	if (channel) {
		channel.channel.users = data.users;
	}
});
