import Msg from "../../models/msg";
import {IrcEventHandler} from "../../this";
import {MessageType} from "../../../shared/types/msg";

export default <IrcEventHandler>function (irc, network) {

	irc.on("info", (data) {
		const lobby = network.getLobby();

		if (data.info) {
			const msg = new Msg({
				type: MessageType.MONOSPACE_BLOCK,
				command: "info",
				text: data.info,
			});
			lobby.pushMessage(this, msg, true);
		}
	});
};
