"use strict";

import Network from "src/models/network";
import {MessageType} from "src/types/models/message";
import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("motd", function (data) {
		const lobby = network.channels[0];

		if (data.motd) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "motd",
				text: data.motd,
			});
			lobby.pushMessage(client, msg);
		}

		if (data.error) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "motd",
				text: data.error,
			});
			lobby.pushMessage(client, msg);
		}
	});
}
