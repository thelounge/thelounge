"use strict";

const Msg = require("../../models/msg");
const Chan = require("../../models/chan");
const Config = require("../../config");

exports.commands = ["close", "leave", "part"];
exports.allowDisconnected = true;

exports.input = function (network, chan, cmd, args) {
	let target = chan;

	if (args.length > 0) {
		const newTarget = network.getChannel(args[0]);

		if (typeof newTarget !== "undefined") {
			// If first argument is a channel user is in, part that channel
			target = newTarget;
			args.shift();
		}
	}

	if (target.type === Chan.Type.LOBBY) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: "You can not part from networks, use /quit instead.",
			})
		);
		return;
	}

	// If target is not a channel or we are not connected, instantly remove the channel
	// Otherwise send part to the server and wait for response
	if (
		target.type !== Chan.Type.CHANNEL ||
		target.state === Chan.State.PARTED ||
		!network.irc ||
		!network.irc.connection ||
		!network.irc.connection.connected
	) {
		this.part(network, target);
	} else {
		const partMessage = args.join(" ") || network.leaveMessage || Config.values.leaveMessage;
		network.irc.part(target.name, partMessage);
	}

	return true;
};
