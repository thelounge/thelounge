"use strict";

const Msg = require("../../models/msg");

module.exports = function (irc, network) {
	const client = this;

	irc.on("info", function (data) {
		const lobby = network.channels[0];

		if (data.info) {
			const msg = new Msg({
				type: Msg.Type.MONOSPACE_BLOCK,
				command: "info",
				text: data.info,
			});
			lobby.pushMessage(client, msg, true);
		}
	});
};
