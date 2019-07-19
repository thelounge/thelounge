"use strict";

const Msg = require("../../models/msg");

exports.commands = ["ctcp"];

exports.input = function({irc}, chan, cmd, args) {
	if (args.length < 2) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: "Usage: /ctcp <nick> <ctcp_type>",
			})
		);
		return;
	}

	chan.pushMessage(
		this,
		new Msg({
			type: Msg.Type.CTCP_REQUEST,
			ctcpMessage: `"${args.slice(1).join(" ")}" to ${args[0]}`,
			from: chan.getUser(irc.user.nick),
		})
	);

	irc.ctcpRequest(...args);
};
