"use strict";

exports.commands = ["notice"];

exports.input = function(network, chan, cmd, args) {
	if (!args[1]) {
		return;
	}

	let targetName = args[0];
	let message = args.slice(1).join(" ");

	network.irc.notice(targetName, message);

	if (!network.irc.network.cap.isEnabled("echo-message")) {
		let targetGroup;
		const parsedTarget = network.irc.network.extractTargetGroup(targetName);

		if (parsedTarget) {
			targetName = parsedTarget.target;
			targetGroup = parsedTarget.target_group;
		}

		const targetChan = network.getChannel(targetName);

		if (typeof targetChan === "undefined") {
			message = "{to " + args[0] + "} " + message;
		}

		network.irc.emit("notice", {
			nick: network.irc.user.nick,
			target: targetName,
			group: targetGroup,
			message: message,
		});
	}

	return true;
};
