import {PluginInputHandler} from "./index.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanType} from "../../../shared/types/chan.js";

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
