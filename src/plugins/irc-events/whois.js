"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("whois", function(data) {
		var chan = network.getChannel(data.nick);
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.QUERY,
				name: data.nick
			});
			chan.loadLogs(client, network.host);
			network.channels.push(chan);
			client.emit("join", {
				shouldOpen: true,
				network: network.id,
				chan: chan
			});
		}

		var msg;
		if (data.error) {
			msg = new Msg({
				type: Msg.Type.ERROR,
				text: "No such nick: " + data.nick
			});
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;

			msg = new Msg({
				type: Msg.Type.WHOIS,
				whois: data
			});
		}

		chan.pushMessage(client, msg);
	});
};
