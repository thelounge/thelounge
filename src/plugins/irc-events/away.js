"use strict";

const _ = require("lodash");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;
	irc.on("away", (data) => {
		const away = data.message;

		network.channels.forEach((chan) => {
			const user = _.find(chan.users, {nick: data.nick});

			if (!user || user.away === away) {
				return;
			}

			const msg = new Msg({
				type: away ? Msg.Type.AWAY : Msg.Type.BACK,
				text: away || "",
				time: data.time,
				from: data.nick,
				mode: user.mode,
			});

			chan.pushMessage(client, msg);
			user.away = away;
		});
	});
};
