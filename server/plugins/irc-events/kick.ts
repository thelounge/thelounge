import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanState} from "../../../shared/types/chan";
import {decodeSmartEncoding} from "./encoding";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("kick", function (data) {
		const chan = network.getChannel(data.channel!);

		if (typeof chan === "undefined") {
			return;
		}

		const user = chan.getUser(data.kicked!);
		// Apply smart encoding detection for ISO-8859-1/15 compatibility
		const msg = new Msg({
			type: MessageType.KICK,
			time: data.time,
			from: chan.getUser(data.nick),
			target: user,
			text: decodeSmartEncoding(data.message || ""),
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
			chan.removeUser(user);
		}
	});
};
