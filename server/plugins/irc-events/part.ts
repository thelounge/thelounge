import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("part", function (data) {
		if (!data.channel) {
			return;
		}

		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const user = chan.getUser(data.nick);
		const msg = new Msg({
			type: MessageType.PART,
			time: data.time,
			text: data.message || "",
			hostmask: data.ident + "@" + data.hostname,
			from: user,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		if (data.nick === irc.user.nick) {
			client.part(network, chan);
		} else {
			chan.removeUser(user);
		}
	});
};
