import socket from "../socket";
import {store} from "../store";

socket.on("messages:latest", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.messages = data.messages;
	channel.moreHistoryAvailable = data.totalMessages > data.messages.length;
	channel.moreNewerAvailable = false;
	channel.scrolledToBottom = true;
	channel.historyLoading = false;
});
