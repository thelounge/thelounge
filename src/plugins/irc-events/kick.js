"use strict";

var _ = require("lodash");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	irc.on("kick", function(data) {
		var chan = network.getChannel(data.channel);
		if (typeof chan === "undefined") {
			return;
		}

		const user = chan.findUser(data.kicked);

		if (data.kicked === irc.user.nick) {
			chan.users = [];
		} else {
			chan.users = _.without(chan.users, user);
		}

		client.emit("users", {
			chan: chan.id
		});

		var msg = new Msg({
			type: Msg.Type.KICK,
			time: data.time,
			mode: user.mode,
			from: data.nick,
			target: data.kicked,
			text: data.message || "",
			highlight: data.kicked === irc.user.nick,
			self: data.nick === irc.user.nick
		});
		chan.pushMessage(client, msg);
	});
};
