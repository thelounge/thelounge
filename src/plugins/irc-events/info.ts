"use strict";

import Network from "src/models/network";
import {MessageType} from "src/types/models/message";

import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("info", function (data) {
		const lobby = network.channels[0];

		if (data.info) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "info",
				text: data.info,
			});
			lobby.pushMessage(client, msg, true);
		}
	});
}
