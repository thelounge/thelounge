import {IrcEventHandler} from "../../client";
import {SpecialChanType, ChanType} from "../../models/chan";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("banlist", (list) => {
		const data = list.bans.map((ban) => ({
			hostmask: ban.banned,
			banned_by: ban.banned_by,
			banned_at: ban.banned_at * 1000,
		}));

		handleList(SpecialChanType.BANLIST, "Ban list", list.channel, data);
	});

	irc.on("inviteList", (list) => {
		const data = list.invites.map((invite) => ({
			hostmask: invite.invited,
			invited_by: invite.invited_by,
			invited_at: invite.invited_at * 1000,
		}));

		handleList(SpecialChanType.INVITELIST, "Invite list", list.channel, data);
	});

	function handleList(
		type: SpecialChanType,
		name: string,
		channel: string,
		data: {
			hostmask: string;
			invited_by?: string;
			inivted_at?: number;
		}[]
	) {
		if (data.length === 0) {
			const msg = new Msg({
				time: new Date(),
				type: MessageType.ERROR,
				text: `${name} is empty`,
			});
			let chan = network.getChannel(channel);

			// Send error to lobby if we receive empty list for a channel we're not in
			if (typeof chan === "undefined") {
				msg.showInActive = true;
				chan = network.getLobby();
			}

			chan.pushMessage(client, msg, true);

			return;
		}

		const chanName = `${name} for ${channel}`;
		let chan = network.getChannel(chanName);

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				type: ChanType.SPECIAL,
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
