import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

export default <IrcEventHandler>function (irc, network) {
	irc.on("motd", (data) => {
		const lobby = network.getLobby();

		if (data.motd) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "motd",
				text: data.motd,
			});
			lobby.pushMessage(this, msg);
		}

		if (data.error) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "motd",
				text: data.error,
			});
			lobby.pushMessage(this, msg);
		}
	});
};
