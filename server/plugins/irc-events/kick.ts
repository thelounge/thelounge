import {IrcEventHandler} from "../../client";
import {ChanState} from "../../models/chan";

import Msg, {MessageType} from "../../models/msg";
import User from "../../models/user";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("kick", function (data) {
		const chan = network.getChannel(data.channel!);

		if (typeof chan === "undefined") {
			return;
		}

		const msg = new Msg({
			type: MessageType.KICK,
			time: data.time,
			from: chan.getUser(data.nick),
			target: chan.getUser(data.kicked!),
			text: data.message || "",
			highlight: data.kicked === irc.user.nick,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		if (data.kicked === irc.user.nick) {
			chan.users = new Map();
			chan.state = ChanState.PARTED;

			client.emit("channel:state", {
				chan: chan.id,
				state: chan.state,
			});
		} else {
			chan.removeUser(msg.target as User);
		}
	});
};
