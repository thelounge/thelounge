"use strict";

import Network from "../../models/network";

import Msg from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("help", function (data) {
		const lobby = network.channels[0];

		if (data.help) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "help",
				text: data.help,
			});
			lobby.pushMessage(client, msg, true);
		}
	});
};
