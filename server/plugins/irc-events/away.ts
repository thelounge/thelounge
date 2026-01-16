import {IrcEventHandler} from "../../client";
import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";
import {decodeSmartEncoding} from "./encoding";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("away", (data) => handleAway(MessageType.AWAY, data));
	irc.on("back", (data) => handleAway(MessageType.BACK, data));

	function handleAway(type: MessageType, data) {
		// Apply smart encoding detection for ISO-8859-1/15 compatibility
		// Note: data.message is used directly for chan.userAway due to existing type quirks
		const away = data.message;
		const awayDecoded = decodeSmartEncoding(away);

		if (data.self) {
			const msg = new Msg({
				self: true,
				type: type,
				text: awayDecoded,
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
						text: awayDecoded || "",
						time: data.time,
						from: user,
					});

					chan.pushMessage(client, msg);

					break;
				}

				case ChanType.CHANNEL: {
					user = chan.findUser(data.nick);

					if (!user || user.away === awayDecoded) {
						return;
					}

					user.away = awayDecoded;

					break;
				}
			}
		});
	}
};
