"use strict";

import Network from "src/models/network";
import {ChanType} from "../../types/models/channel";
import {MessageType} from "src/types/models/message";
import Chan from "../../models/chan";
import Msg from "../../models/msg";

const commands = ["slap", "me"];
const input = function ({irc}: Network, chan: Chan, cmd: string, args: string[]) {
	if (chan.type !== ChanType.CHANNEL && chan.type !== ChanType.QUERY) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: `${cmd} command can only be used in channels and queries.`,
			})
		);

		return;
	}

	let text;

	switch (cmd) {
		case "slap":
			text = "slaps " + args[0] + " around a bit with a large trout";
		/* fall through */
		case "me":
			if (args.length === 0) {
				break;
			}

			text = text || args.join(" ");

			irc.action(chan.name, text);

			if (!irc.network.cap.isEnabled("echo-message")) {
				irc.emit("action", {
					nick: irc.user.nick,
					target: chan.name,
					message: text,
				});
			}

			break;
	}

	return true;
};

export default {
	commands,
	input,
};
