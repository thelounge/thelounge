import Msg from "../../models/msg";
import {IrcEventHandler} from "../../client";
import {MessageType} from "../../../shared/types/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("info", function (data) {
		const lobby = network.getLobby();

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
