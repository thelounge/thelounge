import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

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
