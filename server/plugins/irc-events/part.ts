import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

export default <IrcEventHandler>function (irc, network) {
	irc.on("part", (data) => {
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
		chan.pushMessage(this, msg);

		if (data.nick === irc.user.nick) {
			this.part(network, chan);
		} else {
			chan.removeUser(user);
		}
	});
};
