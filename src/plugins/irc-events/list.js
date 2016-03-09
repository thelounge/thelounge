var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;
	var chanCache = {};
	var MAX_CHANS = 1000;

	irc.on("channel list start", function() {
		chanCache[network.id] = [];

		updateListStatus(new Msg({
			text: "Loading channel list, this can take a moment...",
			type: "channel_list_loading"
		}));
	});

	irc.on("channel list", function(channels) {
		Array.prototype.push.apply(chanCache[network.id], channels);
	});

	irc.on("channel list end", function() {
		updateListStatus(new Msg({
			type: "channel_list",
			channels: chanCache[network.id].slice(0, MAX_CHANS)
		}));

		if (chanCache[network.id].length > MAX_CHANS) {
			updateListStatus(new Msg({
				type: "channel_list_truncated",
				text: "Channel list is too large: truncated to " + MAX_CHANS + " channels."
			}));
		}

		chanCache[network.id] = [];
	});

	function updateListStatus(msg) {
		var chan = network.getChannel("Channel List");
		if (typeof chan === "undefined") {
			chan = new Chan({
				type: Chan.Type.SPECIAL,
				name: "Channel List"
			});
			network.channels.push(chan);
			client.emit("join", {
				network: network.id,
				chan: chan
			});
		}

		client.emit("msg", {
			chan: chan.id,
			msg: msg
		});
	}
};
