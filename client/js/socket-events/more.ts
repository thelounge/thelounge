import {nextTick} from "vue";

import socket from "../socket";
import {store} from "../store";
import {extractInputHistory} from "../helpers/inputHistory";

socket.on("more", async (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.inputHistory = channel.inputHistory.concat(
		extractInputHistory(data.messages, 100 - channel.inputHistory.length)
	);
	channel.moreHistoryAvailable =
		data.moreHistoryAvailable ??
		(data.totalMessages !== undefined &&
			data.totalMessages > channel.messages.length + data.messages.length);
	channel.messages = data.messages.concat(channel.messages);

	await nextTick();
	channel.historyLoading = false;
});

socket.on("history:around", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	if (!data.messages.length) {
		channel.historyLoading = false;
		return;
	}

	channel.messages = data.messages;
	channel.moreHistoryAvailable = data.hasMoreBefore;
	channel.newerMessagesAvailable = data.hasMoreAfter;
	channel.scrolledToBottom = false;
	channel.historyLoading = false;
});

socket.on("history:newer", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.messages.push(...data.messages);
	channel.newerMessagesAvailable = data.hasMoreAfter;
	channel.scrolledToBottom = !data.hasMoreAfter;
	channel.historyLoading = false;
});

socket.on("history:latest", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.messages = data.messages;
	channel.moreHistoryAvailable = data.totalMessages > data.messages.length;
	channel.newerMessagesAvailable = false;
	channel.scrolledToBottom = true;
	channel.historyLoading = false;
});
