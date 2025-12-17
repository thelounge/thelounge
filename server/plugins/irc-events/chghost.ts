import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

export default <IrcEventHandler>function (irc, network) {
	// If server supports CHGHOST cap, then changing the hostname does not require
	// sending PART and JOIN, which means less work for us over all
	irc.on("user updated", (data) => {
		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			const msg = new Msg({
				time: data.time,
				type: MessageType.CHGHOST,
				new_ident: data.ident !== data.new_ident ? data.new_ident : "",
				new_host: data.hostname !== data.new_hostname ? data.new_hostname : "",
				self: data.nick === irc.user.nick,
				from: user,
			});

			// Try to process through mass event aggregator
			// No user list update needed for chghost
			const wasBuffered = this.massEventAggregator.processMessage(
				network,
				chan,
				msg,
				() => {} // No user list changes for chghost
			);

			if (!wasBuffered) {
				// Not in mass event mode - process normally
				chan.pushMessage(this, msg);
			}
		});
	});
};
