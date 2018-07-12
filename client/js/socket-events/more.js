"use strict";

const socket = require("../socket");
const {findChannel} = require("../vue");

socket.on("more", function(data) {
	const channel = findChannel(data.chan);

	if (!channel) {
		return;
	}

	channel.channel.moreHistoryAvailable = data.moreHistoryAvailable;
	channel.channel.messages.unshift(...data.messages);
	channel.channel.historyLoading = false;
});
