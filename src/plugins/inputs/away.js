"use strict";

exports.commands = ["away", "back"];

exports.input = function(network, chan, cmd, args) {
	if (cmd === "away") {
		let reason = " ";

		if (args.length > 0) {
			reason = args.join(" ");
		}

		network.irc.raw("AWAY", reason);

		return;
	}

	network.irc.raw("AWAY");
};
