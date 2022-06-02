import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("quit", function (data) {
		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			const msg = new Msg({
				time: data.time,
				type: MessageType.QUIT,
				text: data.message || "",
				hostmask: data.ident + "@" + data.hostname,
				from: user,
			});
			chan.pushMessage(client, msg);

			chan.removeUser(user);
		});

		// If user with the nick we are trying to keep has quit, try to get this nick
		if (network.keepNick === data.nick) {
			irc.changeNick(network.keepNick);
			network.keepNick = null;
		}
	});
};
