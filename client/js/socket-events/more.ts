import {nextTick} from "vue";

import socket from "../socket";
import {store} from "../store";
import {ClientMessage} from "../types";

socket.on("more", async (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.inputHistory = channel.inputHistory.concat(
		data.messages
			.filter((m) => m.self && m.text && m.type === "message")
			.map((m) => m.text)
			.reverse()
			.slice(0, 100 - channel.inputHistory.length)
	);
	channel.moreHistoryAvailable =
		data.totalMessages > channel.messages.length + data.messages.length;
	channel.messages.unshift(...(data.messages as ClientMessage[]));

	await nextTick();
	channel.historyLoading = false;
});
