import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanState} from "../../../shared/types/chan.js";

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

		// Self kicks should not be buffered and need special handling
		if (data.kicked === irc.user.nick) {
			chan.pushMessage(this, msg);
			chan.users = new Map();
			chan.state = ChanState.PARTED;

			this.emit("channel:state", {
				chan: chan.id,
				state: chan.state,
			});
			return;
		}

		// User list update callback - executed regardless of buffering
		const updateUserList = () => {
			chan.removeUser(user);
		};

		// Try to process through mass event aggregator
		const wasBuffered = this.massEventAggregator.processMessage(
			network,
			chan,
			msg,
			updateUserList
		);

		if (!wasBuffered) {
			// Not in mass event mode - process normally
			chan.pushMessage(this, msg);
			updateUserList();
		}
	});
};
