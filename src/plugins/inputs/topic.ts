"use strict";

import Network from "src/models/network";
import Chan from "src/models/chan";
import Msg from "src/models/msg";
import {ChanType} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";

const commands = ["topic"];

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

	irc.setTopic(chan.name, args.join(" "));
	return true;
};

export default {
	commands,
	input,
};
