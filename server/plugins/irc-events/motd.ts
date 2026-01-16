import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {decodeSmartEncoding} from "./encoding";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("motd", function (data) {
		const lobby = network.getLobby();

		if (data.motd) {
			// Apply smart encoding detection for ISO-8859-1/15 compatibility
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "motd",
				text: decodeSmartEncoding(data.motd),
			});
			lobby.pushMessage(client, msg);
		}

		if (data.error) {
			// Apply smart encoding detection for ISO-8859-1/15 compatibility
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "motd",
				text: decodeSmartEncoding(data.error),
			});
			lobby.pushMessage(client, msg);
		}
	});
};
