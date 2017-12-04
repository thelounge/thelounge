"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;
	irc.on("away", (data) => {
		const away = data.message;

		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (!user || user.away === away) {
				return;
			}

			const msg = new Msg({
				type: away ? Msg.Type.AWAY : Msg.Type.BACK,
				text: away || "",
				time: data.time,
				from: user,
			});

			chan.pushMessage(client, msg);
			user.away = away;
		});
	});
};
