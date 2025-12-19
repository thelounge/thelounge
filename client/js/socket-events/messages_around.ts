import socket from "../socket";
import {store} from "../store";
import eventbus from "../eventbus";

socket.on("messages:around", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	// Merge messages into the channel, avoiding duplicates
	const existingIds = new Set(channel.messages.map((m) => m.id));
	const newMessages = data.messages.filter((m) => !existingIds.has(m.id));

	if (newMessages.length > 0) {
		// Add new messages and sort by time
		channel.messages.push(...newMessages);
		channel.messages.sort((a, b) => {
			const timeA = new Date(a.time).getTime();
			const timeB = new Date(b.time).getTime();
			return timeA - timeB;
		});
	}

	// Emit event to notify that messages have been loaded
	eventbus.emit("messages:around:loaded", {chan: data.chan});
});
