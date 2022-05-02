"use strict";

import Msg from "../../models/msg";
import Chan from "../../models/chan";
import {ChanType} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";
import Network from "src/models/network";

const commands = ["cycle", "rejoin"];

const input = function ({irc}: Network, chan: Chan) {
	if (chan.type !== ChanType.CHANNEL) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "You can only rejoin channels.",
			})
		);
		return;
	}

	irc.part(chan.name, "Rejoining");
	irc.join(chan.name);

	return true;
};

export default {
	commands,
	input,
};
