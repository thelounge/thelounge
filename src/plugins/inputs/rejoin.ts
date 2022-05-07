import {PluginInputHandler} from "./index";

import Msg, {MessageType} from "../../models/msg";
import {ChanType} from "../../models/chan";

const commands = ["cycle", "rejoin"];

const input: PluginInputHandler = function ({irc}, chan) {
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
