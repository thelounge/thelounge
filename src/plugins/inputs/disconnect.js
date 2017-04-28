"use strict";

exports.commands = ["disconnect", "quit"];

exports.input = function(network, chan, cmd, args) {
	var quitMessage = args[0] ? args.join(" ") : "The Lounge — https://thelounge.github.io/";

	network.irc.quit(quitMessage);
};
