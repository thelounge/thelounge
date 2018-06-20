"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("away", (data) => handleAway(Msg.Type.AWAY, data));
	irc.on("back", (data) => handleAway(Msg.Type.BACK, data));

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
			const user = chan.findUser(data.nick);

			if (!user || user.away === away) {
				return;
			}

			const msg = new Msg({
				type: type,
				text: away || "",
				time: data.time,
				from: user,
			});

			chan.pushMessage(client, msg);
			user.away = away;
		});
	}
};
