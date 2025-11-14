import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanState} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {

	irc.on("kick", (data) => {
		const chan = network.getChannel(data.channel!);

		if (typeof chan === "undefined") {
			return;
		}

		const user = chan.getUser(data.kicked!);
		const msg = new Msg({
			type: MessageType.KICK,
			time: data.time,
			from: chan.getUser(data.nick),
			target: user,
			text: data.message || "",
			highlight: data.kicked === irc.user.nick,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(this, msg);

		if (data.kicked === irc.user.nick) {
			chan.users = new Map();
			chan.state = ChanState.PARTED;

			this.emit("channel:state", {
				chan: chan.id,
				state: chan.state,
			});
		} else {
			chan.removeUser(user);
		}
	});
};
