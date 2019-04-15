"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("banlist", (list) => {
		const data = list.bans.map((ban) => ({
			hostmask: ban.banned,
			banned_by: ban.banned_by,
			banned_at: ban.banned_at * 1000,
		}));

		handleList(Chan.SpecialType.BANLIST, "Ban list", list.channel, data);
	});

	irc.on("inviteList", (list) => {
		const data = list.invites.map((invite) => ({
			hostmask: invite.invited,
			invited_by: invite.invited_by,
			invited_at: invite.invited_at * 1000,
		}));

		handleList(Chan.SpecialType.INVITELIST, "Invite list", list.channel, data);
	});

	function handleList(type, name, channel, data) {
		if (data.length === 0) {
			const msg = new Msg({
				time: Date.now(),
				type: Msg.Type.ERROR,
				text: `${name} is empty`,
			});
			let chan = network.getChannel(channel);

			// Send error to lobby if we receive empty list for a channel we're not in
			if (typeof chan === "undefined") {
				msg.showInActive = true;
				chan = network.channels[0];
			}

			chan.pushMessage(client, msg, true);

			return;
		}

		const chanName = `${name} for ${channel}`;
		let chan = network.getChannel(chanName);

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				type: Chan.Type.SPECIAL,
				special: type,
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
	}
};
