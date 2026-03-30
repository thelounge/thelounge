import socket from "../socket";
import {store} from "../store";

socket.on("more:newer", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.messages.push(...data.messages);
	channel.moreNewerAvailable = data.moreAfter;
	channel.historyLoading = false;

	// If we've caught up to the latest messages, switch back to live mode
	if (!data.moreAfter) {
		channel.scrolledToBottom = true;
	}
});
