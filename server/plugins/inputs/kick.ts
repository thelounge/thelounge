import {PluginInputHandler} from "./index";
import Msg, {MessageType} from "../../models/msg";
import {ChanType} from "../../models/chan";

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
