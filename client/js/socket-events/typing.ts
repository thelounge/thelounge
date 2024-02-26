import socket from "../socket";
import {store} from "../store";
import {User} from "../../../server/models/user";
import {TypingStatus} from "../../../server/models/client-tags";

type ServerTypingNotification = {
	status: TypingStatus;
	from: Partial<User>;
	chanId: number;
};

socket.on("channel:isTyping", (data: ServerTypingNotification) => {
	const receivingChannel = store.getters.findChannel(data.chanId);

	if (!receivingChannel) {
		return;
	}

	const channel = receivingChannel.channel;
	const user = channel.users.find((u) => u.nick === data.from.nick);

	if (!user) {
		return;
	}

	if (data.status !== TypingStatus.DONE) {
		user.startTyping(data.status);
	} else {
		user.stopTyping();
	}
});
