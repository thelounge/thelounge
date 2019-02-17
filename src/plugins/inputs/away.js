"use strict";

exports.commands = ["away", "back"];

exports.input = function(network, chan, cmd, args) {
	let reason = "";

	if (cmd === "away") {
		reason = args.join(" ") || " ";

		network.irc.raw("AWAY", reason);
	} else {
		// back command
		network.irc.raw("AWAY");
	}

	network.awayMessage = reason;

	this.save();
};
