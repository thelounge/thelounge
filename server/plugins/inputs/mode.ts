import {PluginInputHandler} from "./index";

import Msg, {MessageType} from "../../models/msg";
import {ChanType} from "../../models/chan";

const commands = ["mode", "umode", "op", "deop", "hop", "dehop", "voice", "devoice"];

const input: PluginInputHandler = function ({irc, nick}, chan, cmd, args) {
	if (cmd === "umode") {
		irc.raw("MODE", nick, ...args);

		return;
	} else if (cmd !== "mode") {
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

		const target = args.filter((arg) => arg !== "");

		if (target.length === 0) {
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: `Usage: /${cmd} <nick> [...nick]`,
				})
			);

			return;
		}

		const mode = {
			op: "+o",
			hop: "+h",
			voice: "+v",
			deop: "-o",
			dehop: "-h",
			devoice: "-v",
		}[cmd];

		const limit = parseInt(irc.network.supports("MODES")) || target.length;

		for (let i = 0; i < target.length; i += limit) {
			const targets = target.slice(i, i + limit);
			const amode = `${mode![0]}${mode![1].repeat(targets.length)}`;
			irc.raw("MODE", chan.name, amode, ...targets);
		}

		return;
	}

	if (args.length === 0 || args[0][0] === "+" || args[0][0] === "-") {
		args.unshift(
			chan.type === ChanType.CHANNEL || chan.type === ChanType.QUERY ? chan.name : nick
		);
	}

	irc.raw("MODE", ...args);
};

export default {
	commands,
	input,
};
