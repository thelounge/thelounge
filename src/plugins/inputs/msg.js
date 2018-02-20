"use strict";

exports.commands = ["msg", "say"];

exports.input = function(network, chan, cmd, args) {
	const target = cmd === "msg" ? args.shift() : chan.name;

	if (args.length === 0 || !target) {
		return true;
	}

	const msg = args.join(" ");

	if (msg.length === 0) {
		return true;
	}

	network.irc.say(target, msg);

	if (!network.irc.network.cap.isEnabled("echo-message")) {
		const channel = network.getChannel(target);

		if (typeof channel !== "undefined") {
			network.irc.emit("privmsg", {
				nick: network.irc.user.nick,
				target: channel.name,
				message: msg,
			});
		}
	}

	return true;
};
