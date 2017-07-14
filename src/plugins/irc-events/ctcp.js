"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("ctcp response", function(data) {
		let chan = network.getChannel(data.nick);
		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		const msg = new Msg({
			type: Msg.Type.CTCP,
			time: data.time,
			from: data.nick,
			ctcpType: data.type,
			ctcpMessage: data.message
		});
		chan.pushMessage(client, msg);
	});

	irc.on("ctcp request", (data) => {
		switch (data.type) {
		case "PING": {
			const split = data.message.split(" ");
			if (split.length === 2) {
				irc.ctcpResponse(data.nick, "PING", split[1]);
			}
			break;
		}
		case "SOURCE": {
			const packageJson = require("../../../package.json");
			irc.ctcpResponse(data.nick, "SOURCE", packageJson.repository.url);
			break;
		}
		}
	});
};
