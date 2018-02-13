"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");
const User = require("../../models/user");

module.exports = function(irc, network) {
	const client = this;

	irc.on("join", function(data) {
		let chan = network.getChannel(data.channel);

		if (typeof chan === "undefined") {
			chan = new Chan({
				name: data.channel,
				state: Chan.State.JOINED,
			});
			network.channels.push(chan);
			client.save();
			client.emit("join", {
				network: network.id,
				chan: chan.getFilteredClone(true),
			});

			// Request channels' modes
			network.irc.raw("MODE", chan.name);
		}

		const user = new User({nick: data.nick});
		const msg = new Msg({
			time: data.time,
			from: user,
			hostmask: data.ident + "@" + data.hostname,
			type: Msg.Type.JOIN,
			self: data.nick === irc.user.nick,
		});
		chan.pushMessage(client, msg);

		chan.setUser(new User({nick: data.nick}));
		client.emit("users", {
			chan: chan.id,
		});
	});
};
