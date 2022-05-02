"use strict";

import Network from "src/models/network";
import {Channel} from "src/types/models/channel";
import {MessageType} from "src/types/models/message";
import Msg from "../../models/msg";

const commands = ["connect", "server"];
const allowDisconnected = true;

const input = function (network: Network, chan: Channel, cmd: string, args: string[]) {
	if (args.length === 0) {
		network.userDisconnected = false;
		this.save();

		const irc = network.irc;

		if (!irc) {
			return;
		}

		if (irc.connection && irc.connection.connected) {
			chan.pushMessage(
				this,
				new Msg({
					type: MessageType.ERROR,
					text: "You are already connected.",
				})
			);
			return;
		}

		irc.connect();

		return;
	}

	let port = args[1] || "";
	const tls = port[0] === "+";

	if (tls) {
		port = port.substring(1);
	}

	const host = args[0];
	this.connect({host, port, tls});

	return true;
};

export default {
	commands,
	input,
};
