"use strict";

import Network from "models/network";

import Msg from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("loggedin", (data) => {
		const lobby = network.channels[0];

		const msg = new Msg({
			type: MessageType.LOGIN,
			text: "Logged in as: " + data.account,
		});
		lobby.pushMessage(client, msg, true);
	});

	irc.on("loggedout", () => {
		const lobby = network.channels[0];

		const msg = new Msg({
			type: MessageType.LOGOUT,
			text: "Logged out",
		});
		lobby.pushMessage(client, msg, true);
	});
};
