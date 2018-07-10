"use strict";

const Chan = require("../../models/chan");

module.exports = function(irc, network) {
	const client = this;
	const MAX_CHANS = 500;

	irc.on("channel list start", function() {
		network.chanCache = [];

		updateListStatus({
			text: "Loading channel list, this can take a moment...",
		});
	});

	irc.on("channel list", function(channels) {
		Array.prototype.push.apply(network.chanCache, channels);

		updateListStatus({
			text: `Loaded ${network.chanCache.length} channels...`,
		});
	});

	irc.on("channel list end", function() {
		updateListStatus(network.chanCache.sort((a, b) => b.num_users - a.num_users).slice(0, MAX_CHANS));

		network.chanCache = [];
	});

	function updateListStatus(msg) {
		let chan = network.getChannel("Channel List");

		if (typeof chan === "undefined") {
			chan = client.createChannel({
				type: Chan.Type.SPECIAL,
				special: Chan.SpecialType.CHANNELLIST,
				name: "Channel List",
				data: msg,
			});

			client.emit("join", {
				network: network.uuid,
				chan: chan.getFilteredClone(true),
				index: network.addChannel(chan),
			});
		} else {
			chan.data = msg;

			client.emit("msg:special", {
				chan: chan.id,
				data: msg,
			});
		}
	}
};
