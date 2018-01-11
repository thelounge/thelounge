"use strict";

exports.commands = ["notice"];

exports.input = function(network, chan, cmd, args) {
	if (!args[1]) {
		return;
	}

	let targetChan = network.getChannel(args[0]);
	let message = args.slice(1).join(" ");

	network.irc.notice(args[0], message);

	if (typeof targetChan === "undefined") {
		message = "{to " + args[0] + "} " + message;
		targetChan = chan;
	}

	if (!network.irc.network.cap.isEnabled("echo-message")) {
		network.irc.emit("notice", {
			nick: network.irc.user.nick,
			target: targetChan.name,
			message: message,
		});
	}

	return true;
};
