"use strict";

const _ = require("lodash");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("kick", function(data) {
		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const msg = new Msg({
			type: Msg.Type.KICK,
			time: data.time,
			from: chan.getUser(data.nick),
			target: chan.getUser(data.kicked),
			text: data.message || "",
			highlight: data.kicked === irc.user.nick,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		if (data.kicked === irc.user.nick) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, msg.target);
		}

		client.emit("users", {
			chan: chan.id,
		});
	});
};
