import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("whois", handleWhois);

	irc.on("whowas", (data) => {
		data.whowas = true;

		handleWhois(data);
	});

	function handleWhois(data) {
		let chan = network.getChannel(data.nick);

		if (typeof chan === "undefined") {
			// Do not create new windows for errors as they may contain illegal characters
			if (data.error) {
				chan = network.getLobby();
			} else {
				chan = client.createChannel({
					type: ChanType.QUERY,
					name: data.nick,
				});

				client.emit("join", {
					network: network.uuid,
					chan: chan.getFilteredClone(true),
					shouldOpen: true,
					index: network.addChannel(chan),
				});
				chan.loadMessages(client, network);
				client.save();
			}
		}

		let msg;

		if (data.error) {
			msg = new Msg({
				type: MessageType.ERROR,
				text: "No such nick: " + data.nick,
			});
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;
			// Absolute datetime in milliseconds when nick logged on.
			data.logonTime = data.logon * 1000;
			msg = new Msg({
				type: MessageType.WHOIS,
				whois: data,
			});
		}

		chan.pushMessage(client, msg);
	}
};
