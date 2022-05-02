"use strict";

import Chan from "src/models/chan";
import Network from "src/models/network";
import {MessageType} from "src/types/models/message";
import Msg from "../../models/msg";

const commands = ["ctcp"];

const input = function ({irc}: Network, chan: Chan, cmd: string, args: string[]) {
	if (args.length < 2) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "Usage: /ctcp <nick> <ctcp_type>",
			})
		);
		return;
	}

	chan.pushMessage(
		this,
		new Msg({
			type: MessageType.CTCP_REQUEST,
			ctcpMessage: `"${args.slice(1).join(" ")}" to ${args[0]}`,
			from: chan.getUser(irc.user.nick),
		})
	);

	// TODO: check. Was ctcpRequest(...args)
	irc.ctcpRequest(args.shift(), args.shift(), ...args);
};

export default {
	commands,
	input,
};
