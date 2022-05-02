"use strict";

import Network from "src/models/network";
import {ChanType} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";
import Chan from "../../models/chan";
import Msg from "../../models/msg";

const commands = ["kick"];

const input = function ({irc}: Network, chan: Chan, cmd: string, args: string[]) {
	if (chan.type !== ChanType.CHANNEL) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: `${cmd} command can only be used in channels.`,
			})
		);

		return;
	}

	if (args.length !== 0) {
		irc.raw("KICK", chan.name, args[0], args.slice(1).join(" "));
	}

	return true;
};

export default {
	commands,
	input,
};
