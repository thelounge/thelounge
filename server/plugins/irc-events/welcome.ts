import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("registered", function (data) {
		const nickKeeper = network.getNickKeeper();
		const {shouldUpdatePreferred} = nickKeeper.onRegistered(data.nick, network.nick);

		// Only update the user's preferred nick (network.nick) if we registered with it
		// If we registered with a fallback nick (e.g., nick123), don't overwrite the preference
		if (shouldUpdatePreferred) {
			network.setNick(data.nick);
		} else {
			// We registered with a fallback, don't call setNick which would overwrite the preference
			// Just update the IRC session nick
			irc.user.nick = data.nick;
		}

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
