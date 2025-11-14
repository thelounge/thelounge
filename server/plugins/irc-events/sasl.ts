import {IrcEventHandler} from "../../this";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

export default <IrcEventHandler>function (irc, network) {

	irc.on("loggedin", (data) => {
		const lobby = network.getLobby();

		const msg = new Msg({
			type: MessageType.LOGIN,
			text: "Logged in as: " + data.account,
		});
		lobby.pushMessage(this, msg, true);
	});

	irc.on("loggedout", () => {
		const lobby = network.getLobby();

		const msg = new Msg({
			type: MessageType.LOGOUT,
			text: "Logged out",
		});
		lobby.pushMessage(this, msg, true);
	});
};
