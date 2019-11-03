"use strict";

const socket = require("../socket");
const {vueApp} = require("../vue");
const store = require("../store").default;

socket.on("more", function(data) {
	const channel = store.getters.findChannel(data.chan);

	if (!channel) {
		return;
	}

	channel.channel.moreHistoryAvailable =
		data.totalMessages > channel.channel.messages.length + data.messages.length;
	channel.channel.messages.unshift(...data.messages);

	vueApp.$nextTick(() => {
		channel.channel.historyLoading = false;
	});
});
