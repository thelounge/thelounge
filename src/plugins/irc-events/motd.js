"use strict";

var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("motd", function(data) {
		var lobby = network.channels[0];

		if (data.motd) {
			data.motd.split("\n").forEach((text) => {
				var msg = new Msg({
					type: Msg.Type.MOTD,
					text: text
				});
				lobby.pushMessage(client, msg);
			});
		}

		if (data.error) {
			var msg = new Msg({
				type: Msg.Type.MOTD,
				text: data.error
			});
			lobby.pushMessage(client, msg);
		}
	});
};
