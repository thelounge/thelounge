import Msg, {MessageType} from "../../models/msg";
import {IrcEventHandler} from "../../client";

export default <IrcEventHandler>function (irc, network) {
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
};
