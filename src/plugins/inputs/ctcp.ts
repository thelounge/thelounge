"use strict";

import Msg, {MessageType} from "../../models/msg";
import {PluginInputHandler} from "./index";

const commands = ["ctcp"];

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
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
	const target = args.shift()!;
	const type = args.shift()!;

	irc.ctcpRequest(target, type, ...args);
};

export default {
	commands,
	input,
};
