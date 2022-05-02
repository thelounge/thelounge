"use strict";

import Network from "src/models/network";
import {ChanType} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";
import Chan from "../../models/chan";
import Msg from "../../models/msg";

const commands = ["invite", "invitelist"];

const input = function ({irc}: Network, chan: Chan, cmd: string, args: string[]) {
	if (cmd === "invitelist") {
		irc.inviteList(chan.name);
		return;
	}

	if (args.length === 2) {
		irc.raw("INVITE", args[0], args[1]); // Channel provided in the command
	} else if (args.length === 1 && chan.type === ChanType.CHANNEL) {
		irc.raw("INVITE", args[0], chan.name); // Current channel
	} else {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: `${cmd} command can only be used in channels or by specifying a target.`,
			})
		);
	}
};

export default {
	commands,
	input,
};
