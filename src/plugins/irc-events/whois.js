"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;
	irc.on("whois", function(data) {
		let chan = network.getChannel(data.nick);

		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.QUERY,
				name: data.nick,
			});

			client.emit("join", {
				shouldOpen: true,
				network: network.id,
				chan: chan.getFilteredClone(true),
				index: network.addChannel(chan),
			});
			chan.loadMessages(client, network);
			client.save();
		}

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

		chan.pushMessage(client, msg);
	});
};
