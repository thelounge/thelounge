import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

export default <IrcEventHandler>function (irc, network) {
	irc.on("nick", (data) => {
		const self = data.nick === irc.user.nick;

		if (self) {
			network.setNick(data.new_nick);

			const lobby = network.getLobby();
			const msg = new Msg({
				text: `You're now known as ${data.new_nick}`,
			});
			lobby.pushMessage(this, msg, true);

			this.save();
			this.emit("nick", {
				network: network.uuid,
				nick: data.new_nick,
			});
		}

		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			const msg = new Msg({
				time: data.time,
				from: user,
				type: MessageType.NICK,
				new_nick: data.new_nick,
			});

			// User list update callback - executed regardless of buffering
			const updateUserList = () => {
				chan.removeUser(user);
				user.nick = data.new_nick;
				chan.setUser(user);

				this.emit("users", {
					chan: chan.id,
				});
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
	});
};
