"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;
	irc.on("whois", function(data) {
		const lobby = network.channels[0];

		let msg;
		if (data.error) {
			msg = new Msg({
				type: Msg.Type.ERROR,
				text: "No such nick: " + data.nick,
			});
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;
			// Absolute datetime in milliseconds when nick logged on.
			data.logonTime = data.logon * 1000;
			msg = new Msg({
				type: Msg.Type.WHOIS,
				whois: data,
			});
		}

		msg.showInActive = true;
		lobby.pushMessage(client, msg);
	});
};
