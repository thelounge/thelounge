"use strict";

var Chan = require("../../models/chan");
var _ = require("lodash");

exports.commands = ["join"];

exports.input = function(network, chan, cmd, args) {
	var client = this;
	if (args.length !== 0) {
		var irc = network.irc;
		if (args.length === 2) {
			irc.join(args[0], args[1]);
		} else {
			irc.join(args[0]);
		}
		_.zip(args[0].split(/,/g), args[1].split(/,/g))
			.map(function(chanPairs) {
				var channel = new Chan({
					type: Chan.Type.CHANNEL,
					name: chanPairs[0],
					key: chanPairs[1],
				});
				network.channels.push(channel);
				client.emit("join", {
					network: network.id,
					chan: channel
				});
			});
	}
	this.save();
	return true;
};
