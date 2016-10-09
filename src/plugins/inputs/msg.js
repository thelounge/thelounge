"use strict";

exports.commands = ["msg", "say"];

exports.input = function(network, chan, cmd, args) {
	var irc = network.irc;
	var target = cmd === "msg" ? args.shift() : chan.name;

	if (args.length === 0 || !target) {
		return true;
	}

	var msg = args.join(" ");

	if (msg.length === 0) {
		return true;
	}

	irc.say(target, msg);

	if (!network.irc.network.cap.isEnabled("echo-message")) {
		var channel = network.getChannel(target);
		if (typeof channel !== "undefined") {
			irc.emit("privmsg", {
				nick: irc.user.nick,
				target: channel.name,
				message: msg
			});
		}
	}

	return true;
};
