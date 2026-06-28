import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("registered", function (data) {
		network.nickKeeper.onRegistered(data.nick, {
			setPreferredNick(nick) {
				network.setNick(nick);
			},
			setCurrentNick(nick) {
				irc.user.nick = nick;
			},
		});

		const lobby = network.getLobby();
		const msg = new Msg({
			text: "You're now known as " + data.nick,
		});
		lobby.pushMessage(client, msg);

		client.save();
		client.emit("nick", {
			network: network.uuid,
			nick: data.nick,
		});
	});
};
