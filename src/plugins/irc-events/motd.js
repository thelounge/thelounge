"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("motd", function(data) {
		const lobby = network.channels[0];

		if (data.motd) {
			data.motd.split("\n").forEach((text) => {
				const msg = new Msg({
					type: Msg.Type.MOTD,
					text: text,
				});
				lobby.pushMessage(client, msg);
			});
		}

		if (data.error) {
			const msg = new Msg({
				type: Msg.Type.MOTD,
				text: data.error,
			});
			lobby.pushMessage(client, msg);
		}
	});
};
