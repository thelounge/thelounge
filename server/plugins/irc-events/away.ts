import {IrcEventHandler} from "../../client";
import {ChanType} from "../../models/chan";
import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("away", (data) => handleAway(MessageType.AWAY, data));
	irc.on("back", (data) => handleAway(MessageType.BACK, data));

	function handleAway(type: MessageType, data) {
		const away = data.message;

		if (data.self) {
			const msg = new Msg({
				self: true,
				type: type,
				text: away,
				time: data.time,
			});

			network.getLobby().pushMessage(client, msg, true);

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
};
