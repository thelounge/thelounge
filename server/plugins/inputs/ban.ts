import {ChanType} from "../../models/chan";
import Msg, {MessageType} from "../../models/msg";
import {PluginInputHandler} from "./index";

const commands = ["ban", "unban", "banlist", "kickban"];

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

	if (cmd !== "banlist" && args.length === 0) {
		if (args.length === 0) {
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: `Usage: /${cmd} <nick>`,
				})
			);

			return;
		}
	}

	switch (cmd) {
		case "kickban":
			irc.raw("KICK", chan.name, args[0], args.slice(1).join(" "));
		// fall through
		case "ban":
			irc.ban(chan.name, args[0]);
			break;
		case "unban":
			irc.unban(chan.name, args[0]);
			break;
		case "banlist":
			irc.banlist(chan.name);
			break;
	}
};

export default {
	commands,
	input,
};
