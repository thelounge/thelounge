import Msg from "../../models/msg";
import {IrcEventHandler} from "../../client";
import {MessageType} from "../../../shared/types/msg";

export default <IrcEventHandler>function (irc, network) {
	irc.on("help", (data) => {
		const lobby = network.getLobby();

		if (data.help) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "help",
				text: data.help,
			});
			lobby.pushMessage(this, msg, true);
		}
	});
};
