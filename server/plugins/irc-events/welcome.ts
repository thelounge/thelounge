import {IrcEventHandler} from "../../this";

import Msg from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {

	irc.on("registered", (data) => {
		network.setNick(data.nick);

		const lobby = network.getLobby();
		const msg = new Msg({
			text: "You're now known as " + data.nick,
		});
		lobby.pushMessage(this, msg);

		this.save();
		this.emit("nick", {
			network: network.uuid,
			nick: data.nick,
		});
	});
};
