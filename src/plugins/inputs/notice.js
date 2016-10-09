"use strict";

exports.commands = ["notice"];

exports.input = function(network, chan, cmd, args) {
	if (!args[1]) {
		return;
	}

	var message = args.slice(1).join(" ");
	var irc = network.irc;
	irc.notice(args[0], message);

	var targetChan = network.getChannel(args[0]);
	if (typeof targetChan === "undefined") {
		message = "{to " + args[0] + "} " + message;
		targetChan = chan;
	}

	if (!network.irc.network.cap.isEnabled("echo-message")) {
		irc.emit("notice", {
			nick: irc.user.nick,
			target: targetChan.name,
			message: message
		});
	}

	return true;
};
