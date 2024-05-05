import {nextTick} from "vue";

import socket from "../socket";
import {store} from "../store";
import {MessageType} from "../../../shared/types/msg";

socket.on("more", async (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.inputHistory = channel.inputHistory.concat(
		data.messages
			.filter((m) => m.self && m.text && m.type === MessageType.MESSAGE)
			// TS is too stupid to see the guard in .filter(), so we monkey patch it
			// to please the compiler
			.map((m) => (m.text ? m.text : ""))
			.reverse()
			.slice(0, 100 - channel.inputHistory.length)
	);
	channel.moreHistoryAvailable =
		data.totalMessages > channel.messages.length + data.messages.length;
	channel.messages.unshift(...data.messages);

	await nextTick();
	channel.historyLoading = false;
});
