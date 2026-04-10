import {PluginInputHandler} from "./index";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";
import {ChanType} from "../../../shared/types/chan";

const commands = ["topic", "cleartopic"];

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

	if (cmd === "cleartopic") {
		irc.clearTopic(chan.name);
		return;
	}

	const cleanArgs = args.map((s) => s.trim()).filter((s) => s !== "");

	if (cleanArgs.length === 0) {
		irc.raw("TOPIC", chan.name);
		return;
	}

	// we use the non trimmed args here, the user may have added white space on purpose
	irc.setTopic(chan.name, args.join(" "));
	return true;
};

export default {
	commands,
	input,
};
