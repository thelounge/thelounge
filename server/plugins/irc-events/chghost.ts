import type {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import type User from "../../models/user";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";

// https://ircv3.net/specs/extensions/chghost
// extended-monitor lets us also receive CHGHOST for nicks we don't share a
// channel with — surface those in the matching query.
export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("user updated", function (data) {
		// 'user updated' is also emitted for SETNAME (no host change). Ignore
		// those here — the chghost message template doesn't represent gecos.
		if (data.ident === data.new_ident && data.hostname === data.new_hostname) {
			return;
		}

		const buildMsg = (from: User) =>
			new Msg({
				time: data.time,
				type: MessageType.CHGHOST,
				new_ident: data.ident !== data.new_ident ? data.new_ident : "",
				new_host: data.hostname !== data.new_hostname ? data.new_hostname : "",
				self: data.nick === irc.user.nick,
				from,
			});

		let touchedSharedChannel = false;

		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			touchedSharedChannel = true;
			chan.pushMessage(client, buildMsg(user));
		});

		if (touchedSharedChannel) {
			return;
		}

		const query = network.getChannel(data.nick);

		if (query?.type === ChanType.QUERY) {
			query.pushMessage(client, buildMsg(query.getUser(data.nick)));
		}
	});
};
