"use strict";

import socket from "../socket";
import store from "../store";

socket.on("history:clear", function (data) {
	const {channel} = store.getters.findChannel(data.target);

	channel.messages = [];
	channel.unread = 0;
	channel.highlight = 0;
	channel.firstUnread = 0;
	channel.moreHistoryAvailable = false;
});
