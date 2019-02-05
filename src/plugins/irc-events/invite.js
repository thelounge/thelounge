"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("invite", function(data) {
		let chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		const invitedYou = data.invited === irc.user.nick;

		const msg = new Msg({
			type: Msg.Type.INVITE,
			time: data.time,
			from: chan.getUser(data.nick),
			target: chan.getUser(data.invited),
			channel: data.channel,
			highlight: invitedYou,
			invitedYou: invitedYou,
		});
		chan.pushMessage(client, msg);
	});
};
