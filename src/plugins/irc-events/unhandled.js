"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("unknown command", function(command) {
		let target = network.channels[0];

		if (command.params.length > 0) {
			// Do not display users own name
			if (command.params[0] === network.irc.user.nick) {
				command.params.shift();
			} else {
				// If this numeric starts with a channel name that exists
				// put this message in that channel
				const channel = network.getChannel(command.params[0]);

				if (typeof channel !== "undefined") {
					target = channel;
				}
			}
		}

		target.pushMessage(
			client,
			new Msg({
				type: Msg.Type.UNHANDLED,
				command: command.command,
				params: command.params,
			}),
			true
		);
	});
};
