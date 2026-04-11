import socket from "../socket";
import {store} from "../store";
import eventbus from "../eventbus";

socket.on("messages:around", (data) => {
	const channel = store.getters.findChannel(data.chan)?.channel;

	if (!channel) {
		return;
	}

	// Replace the channel's messages with the messages around the target
	channel.messages = data.messages;
	channel.moreHistoryAvailable = data.moreHistoryBefore;
	channel.moreNewerAvailable = true;
	channel.scrolledToBottom = false;

	// Reset unread marker so "New messages" line doesn't appear when browsing via mention
	if (data.messages.length > 0) {
		channel.firstUnread = data.messages[data.messages.length - 1].id;
	}

	// Notify that we should scroll to the target message
	eventbus.emit("mentions:scrollTo", data.msgId);
});
