import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("account", function (data) {
		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			user.account = data.account ? data.account : "";
			chan.setUser(user);

			client.emit("users", {
				chan: chan.id,
			});
		});
	});
};
