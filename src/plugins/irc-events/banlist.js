"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("banlist", function(banlist) {
		const channel = banlist.channel;
		const bans = banlist.bans;

		if (!bans || bans.length === 0) {
			const msg = new Msg({
				time: Date.now(),
				type: Msg.Type.ERROR,
				text: "Banlist empty",
			});
			let chan = network.getChannel(channel);

			// Send error to lobby if we receive banlist for a channel we're not in
			if (typeof chan === "undefined") {
				msg.showInActive = true;
				chan = network.channels[0];
			}

			chan.pushMessage(client, msg, true);

			return;
		}

		const chanName = `Banlist for ${channel}`;
		let chan = network.getChannel(chanName);
		const data = bans.map((data) => ({
			hostmask: data.banned,
			banned_by: data.banned_by,
			banned_at: data.banned_at * 1000,
		}));

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				type: Chan.Type.SPECIAL,
				special: Chan.SpecialType.BANLIST,
				name: chanName,
				data: data,
			});
			client.emit("join", {
				network: network.uuid,
				chan: chan.getFilteredClone(true),
				index: network.addChannel(chan),
			});
		} else {
			chan.data = data;

			client.emit("msg:special", {
				chan: chan.id,
				data: data,
			});
		}
	});
};
