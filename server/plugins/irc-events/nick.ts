import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("nick", function (data) {
		const self = data.nick === irc.user.nick;

		if (self) {
			network.setNick(data.new_nick);

			const lobby = network.getLobby();
			const msg = new Msg({
				text: `You're now known as ${data.new_nick}`,
			});
			lobby.pushMessage(client, msg, true);

			client.save();
			client.emit("nick", {
				network: network.uuid,
				nick: data.new_nick,
			});
		}

		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				// Update monitor list for query channels that match the old nick
				if (
					chan.type === ChanType.QUERY &&
					chan.name.toLowerCase() === data.nick.toLowerCase()
				) {
					network.removeMonitor(data.nick);
					chan.name = data.new_nick;
					network.monitor(data.new_nick);
				}

				return;
			}

			const msg = new Msg({
				time: data.time,
				from: user,
				type: MessageType.NICK,
				new_nick: data.new_nick,
			});
			chan.pushMessage(client, msg);

			chan.removeUser(user);
			user.nick = data.new_nick;
			chan.setUser(user);

			client.emit("users", {
				chan: chan.id,
			});
		});
	});
};
