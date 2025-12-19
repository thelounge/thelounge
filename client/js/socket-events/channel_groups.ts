import socket from "../socket";
import {store} from "../store";

// Handle channel groups from seedpool/enhanced capable servers
socket.on("channel:groups", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	// Create a new array to ensure Vue reactivity detects the change
	channel.groups = [...data.groups];
});
