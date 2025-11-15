import {PluginInputHandler} from "./index.js";
import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanType} from "../../../shared/types/chan.js";

const commands = ["kick"];

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

	if (args.length !== 0) {
		irc.raw("KICK", chan.name, args[0], args.slice(1).join(" "));
	}

	return true;
};

export default {
	commands,
	input,
};
