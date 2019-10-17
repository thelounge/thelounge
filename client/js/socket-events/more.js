"use strict";

const socket = require("../socket");
const {vueApp, findChannel} = require("../vue");

socket.on("more", function(data) {
	const channel = findChannel(data.chan);

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
