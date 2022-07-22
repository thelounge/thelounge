import {PluginInputHandler} from "./index";

import Msg, {MessageType} from "../../models/msg";
import {ChanType} from "../../models/chan";

const commands = ["topic"];

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
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
