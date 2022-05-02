"use strict";

import Network from "src/models/network";
import {ChanType} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";
import Msg from "../../models/msg";

export default function (irc: Network["irc"], network: Network) {
	const client = this;

	irc.on("away", (data) => handleAway(MessageType.AWAY, data));
	irc.on("back", (data) => handleAway(MessageType.BACK, data));

	function handleAway(type, data) {
		const away = data.message;

		if (data.self) {
			const msg = new Msg({
				self: true,
				type: type,
				text: away,
				time: data.time,
			});

			network.channels[0].pushMessage(client, msg, true);

			return;
		}

		network.channels.forEach((chan) => {
			let user;

			switch (chan.type) {
				case ChanType.QUERY: {
					if (data.nick.toLowerCase() !== chan.name.toLowerCase()) {
						return;
					}

					if (chan.userAway === away) {
						return;
					}

					// Store current away message on channel model,
					// because query windows have no users
					chan.userAway = away;

					user = chan.getUser(data.nick);

					const msg = new Msg({
						type: type,
						text: away || "",
						time: data.time,
						from: user,
					});

					chan.pushMessage(client, msg);

					break;
				}

				case ChanType.CHANNEL: {
					user = chan.findUser(data.nick);

					if (!user || user.away === away) {
						return;
					}

					user.away = away;

					break;
				}
			}
		});
	}
}
