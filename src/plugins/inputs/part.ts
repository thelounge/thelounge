"use strict";

import Msg from "src/models/msg";
import Chan from "src/models/chan";
import Config from "src/config";
import Network from "src/models/network";
import {MessageType} from "src/types/models/message";
import {ChanState, ChanType} from "src/types/models/channel";

const commands = ["close", "leave", "part"];
const allowDisconnected = true;

const input = function (network: Network, chan: Chan, cmd: string, args: string[]) {
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
		!network.irc ||
		!network.irc.connection ||
		!network.irc.connection.connected
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
