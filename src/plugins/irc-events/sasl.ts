"use strict";

const Msg = require("../../models/msg");

module.exports = function (irc, network) {
	const client = this;

	irc.on("loggedin", (data) => {
		const lobby = network.channels[0];

		const msg = new Msg({
			type: Msg.Type.LOGIN,
			text: "Logged in as: " + data.account,
		});
		lobby.pushMessage(client, msg, true);
	});

	irc.on("loggedout", () => {
		const lobby = network.channels[0];

		const msg = new Msg({
			type: Msg.Type.LOGOUT,
			text: "Logged out",
		});
		lobby.pushMessage(client, msg, true);
	});
};
