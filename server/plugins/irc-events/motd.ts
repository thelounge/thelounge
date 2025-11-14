import {IrcEventHandler} from "../../this";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

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
