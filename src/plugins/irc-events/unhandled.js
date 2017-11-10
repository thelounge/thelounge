"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("unknown command", function(command) {
		// Do not display users own name
		if (command.params[0] === network.irc.user.nick) {
			command.params.shift();
		}

		network.channels[0].pushMessage(client, new Msg({
			type: Msg.Type.UNHANDLED,
			command: command.command,
			params: command.params,
		}), true);
	});
};
