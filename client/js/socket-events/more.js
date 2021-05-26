"use strict";

import Vue from "vue";

import socket from "../socket";
import store from "../store";

socket.on("more", function (data) {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	channel.inputHistory = channel.inputHistory.concat(
		data.messages
			.filter((m) => m.self && m.text && m.type === "message")
			.map((m) => m.text)
			.reverse()
			.slice(null, 100 - channel.inputHistory.length)
	);
	channel.moreHistoryAvailable =
		data.totalMessages > channel.messages.length + data.messages.length;
	channel.messages.unshift(...data.messages);

	Vue.nextTick(() => {
		channel.historyLoading = false;
	});
});
