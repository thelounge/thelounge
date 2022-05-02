"use strict";

import Network from "src/models/network";
import {MessageType} from "src/types/models/message";

import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("part", function (data) {
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
}
