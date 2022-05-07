import {PluginInputHandler} from "./index";
import Msg, {MessageType} from "../../models/msg";
import {ChanType} from "../../models/chan";

const commands = ["invite", "invitelist"];

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
	if (cmd === "invitelist") {
		irc.inviteList(chan.name);
		return;
	}

	if (args.length === 2) {
		irc.raw("INVITE", args[0], args[1]); // Channel provided in the command
	} else if (args.length === 1 && chan.type === ChanType.CHANNEL) {
		irc.raw("INVITE", args[0], chan.name); // Current channel
	} else {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: `${cmd} command can only be used in channels or by specifying a target.`,
			})
		);
	}
};

export default {
	commands,
	input,
};
