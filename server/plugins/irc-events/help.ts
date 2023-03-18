import Msg, {MessageType} from "../../models/msg";
import {IrcEventHandler} from "../../client";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("help", function (data) {
		const lobby = network.getLobby();

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
