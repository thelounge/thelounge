import {IrcEventHandler} from "../../client.js";
import type Client from "../../client.js";

import Chan from "../../models/chan.js";
import {ChanType, SpecialChanType} from "../../../shared/types/chan.js";

export default <IrcEventHandler>function (this: Client, irc, network) {
	const MAX_CHANS = 500;

	irc.on("channel list start", () => {
		network.chanCache = [];

		updateListStatus.call(this, {
			text: "Loading channel list, this can take a moment...",
		});
	});

	irc.on("channel list", (channels) => {
		Array.prototype.push.apply(network.chanCache, channels);

		updateListStatus.call(this, {
			text: `Loaded ${network.chanCache.length} channels...`,
		});
	});

	irc.on("channel list end", () => {
		updateListStatus.call(
			this,
			network.chanCache.sort((a, b) => b.num_users! - a.num_users!).slice(0, MAX_CHANS)
		);

		network.chanCache = [];
	});

	function updateListStatus(
		this: Client,
		msg:
			| {
					text: string;
			  }
			| Chan[]
	) {
		let chan = network.getChannel("Channel List");

		if (typeof chan === "undefined") {
			chan = this.createChannel({
				type: ChanType.SPECIAL,
				special: SpecialChanType.CHANNELLIST,
				name: "Channel List",
				data: msg,
			});

			this.emit("join", {
				network: network.uuid,
				chan: chan!.getFilteredClone(true),
				shouldOpen: false,
				index: network.addChannel(chan!),
			});
		} else {
			chan.data = msg;

			this.emit("msg:special", {
				chan: chan.id,
				data: msg,
			});
		}
	}
};
