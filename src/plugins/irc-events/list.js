"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;
	const MAX_CHANS = 500;

	irc.on("channel list start", function() {
		network.chanCache = [];

		updateListStatus(new Msg({
			text: "Loading channel list, this can take a moment...",
			type: "channel_list_loading",
		}));
	});

	irc.on("channel list", function(channels) {
		Array.prototype.push.apply(network.chanCache, channels);
	});

	irc.on("channel list end", function() {
		updateListStatus(new Msg({
			type: "channel_list",
			channels: network.chanCache.sort(function(a, b) {
				return b.num_users - a.num_users;
			}).slice(0, MAX_CHANS),
		}));

		if (network.chanCache.length > MAX_CHANS) {
			updateListStatus(new Msg({
				type: "channel_list_truncated",
				text: "Channel list is too large: truncated to " + MAX_CHANS + " channels.",
			}));
		}

		network.chanCache = [];
	});

	function updateListStatus(msg) {
		let chan = network.getChannel("Channel List");

		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.SPECIAL,
				name: "Channel List",
			});

			client.emit("join", {
				network: network.id,
				chan: chan.getFilteredClone(true),
				index: network.addChannel(chan),
			});
		}

		client.emit("msg", {
			chan: chan.id,
			msg: msg,
		});
	}
};
