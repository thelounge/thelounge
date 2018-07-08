"use strict";

const _ = require("lodash");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("part", function(data) {
		const chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			return;
		}

		const user = chan.getUser(data.nick);
		const msg = new Msg({
			type: Msg.Type.PART,
			time: data.time,
			text: data.message || "",
			hostmask: data.ident + "@" + data.hostname,
			from: user,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		if (data.nick === irc.user.nick) {
			network.channels = _.without(network.channels, chan);
			chan.destroy();
			client.save();
			client.emit("part", {
				chan: chan.id,
			});
		} else {
			chan.removeUser(user);
			client.emit("users", {
				chan: chan.id,
			});
		}
	});
};
