"use strict";

import Vue from "vue";

import socket from "../socket";
import store from "../store";

socket.on("more", function (data) {
	const channel = store.getters.findChannel(data.chan);

	if (!channel) {
		return;
	}

	channel.channel.moreHistoryAvailable =
		data.totalMessages > channel.channel.messages.length + data.messages.length;
	channel.channel.messages.unshift(...data.messages);

	Vue.nextTick(() => {
		channel.channel.historyLoading = false;
	});
});
