"use strict";

const Msg = require("../../models/msg");

module.exports = function (irc, network) {
	const client = this;

	irc.on("help", function (data) {
		const lobby = network.channels[0];

		if (data.help) {
			const msg = new Msg({
				type: Msg.Type.MONOSPACE_BLOCK,
				command: "help",
				text: data.help,
			});
			lobby.pushMessage(client, msg, true);
		}
	});
};
