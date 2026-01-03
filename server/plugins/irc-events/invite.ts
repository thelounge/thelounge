import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

export default <IrcEventHandler>function (irc, network) {
	irc.on("invite", (data) => {
		let chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			chan = network.getLobby();
		}

		const invitedYou = data.invited === irc.user.nick;

		const msg = new Msg({
			type: MessageType.INVITE,
			time: data.time,
			from: chan.getUser(data.nick),
			target: chan.getUser(data.invited),
			channel: data.channel,
			highlight: invitedYou,
			invitedYou: invitedYou,
		});
		chan.pushMessage(this, msg);
	});
};
