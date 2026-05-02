import socket from "../socket";
import {store} from "../store";

socket.on("msg:reactions", function (data) {
	const receivingChannel = store.getters.findChannel(data.chan);

	if (!receivingChannel) {
		return;
	}

	const channel = receivingChannel.channel;
	const message = channel.messages.find((m) => m.msgid === data.msgid);

	if (!message) {
		return;
	}

	if (Object.keys(data.reactions).length === 0) {
		delete message.reactions;
	} else {
		message.reactions = data.reactions;
	}
});
