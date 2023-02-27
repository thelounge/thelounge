import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("loggedin", (data) => {
		const lobby = network.getLobby();

		const msg = new Msg({
			type: MessageType.LOGIN,
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			text: "Logged in as: " + data.account,
		});
		lobby.pushMessage(client, msg, true);
	});

	irc.on("loggedout", () => {
		const lobby = network.getLobby();

		const msg = new Msg({
			type: MessageType.LOGOUT,
			text: "Logged out",
		});
		lobby.pushMessage(client, msg, true);
	});
};
