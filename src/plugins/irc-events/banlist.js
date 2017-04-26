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
				text: "Banlist empty"
			});
			network.getChannel(channel).pushMessage(client, msg, true);
			return;
		}

		const chanName = `Banlist for ${channel}`;
		let chan = network.getChannel(chanName);
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.SPECIAL,
				name: chanName
			});
			network.channels.push(chan);
			client.emit("join", {
				network: network.id,
				chan: chan
			});
		}

		chan.pushMessage(client,
			new Msg({
				type: Msg.Type.BANLIST,
				bans: bans.map((data) => ({
					hostmask: data.banned,
					banned_by: data.banned_by,
					banned_at: data.banned_at * 1000
				}))
			}),
			true
		);
	});
};
