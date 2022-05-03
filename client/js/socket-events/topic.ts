"use strict";

import socket from "../socket";
import store from "../store";

socket.on("topic", function (data) {
	const channel = store.getters.findChannel(data.chan);

	if (channel) {
		channel.channel.topic = data.topic;
	}
});
