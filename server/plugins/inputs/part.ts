import {PluginInputHandler} from "./index.js";

import Msg from "../../models/msg.js";
import Config from "../../config.js";
import {MessageType} from "../../../shared/types/msg.js";
import {ChanType, ChanState} from "../../../shared/types/chan.js";

const commands = ["close", "leave", "part"];
const allowDisconnected = true;

const input: PluginInputHandler = function (network, chan, cmd, args) {
	let target = chan;

	if (args.length > 0) {
		const newTarget = network.getChannel(args[0]);

		if (typeof newTarget !== "undefined") {
			// If first argument is a channel user is in, part that channel
			target = newTarget;
			args.shift();
		}
	}

	if (target.type === ChanType.LOBBY) {
		chan.pushMessage(
			this,
			new Msg({
				type: MessageType.ERROR,
				text: "You can not part from networks, use /quit instead.",
			})
		);
		return;
	}

	// If target is not a channel or we are not connected, instantly remove the channel
	// Otherwise send part to the server and wait for response
	if (
		target.type !== ChanType.CHANNEL ||
		target.state === ChanState.PARTED ||
		!network.irc.connected
	) {
		this.part(network, target);
	} else {
		const partMessage = args.join(" ") || network.leaveMessage || Config.values.leaveMessage;
		network.irc.part(target.name, partMessage);
	}

	return true;
};

export default {
	commands,
	input,
	allowDisconnected,
};
