"use strict";

import Vue from "vue";

import socket from "../socket";
import store from "../store";

socket.on("more", function (data) {
	const channel = store.getters.findChannel(data.chan).channel;

	if (!channel) {
		return;
	}

	channel.moreHistoryAvailable =
		data.totalMessages > channel.messages.length + data.messages.length;
	channel.messages.unshift(...data.messages);

	Vue.nextTick(() => {
		channel.historyLoading = false;
	});
});
