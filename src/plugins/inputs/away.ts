"use strict";

import Network from "src/models/network";
import {Channel} from "src/types/models/channel";

const commands = ["away", "back"];

const input = function (network: Network, chan: Channel, cmd: string, args: string[]) {
	let reason = "";

	if (cmd === "away") {
		reason = args.join(" ") || " ";

		network.irc.raw("AWAY", reason);
	} else {
		// back command
		network.irc.raw("AWAY");
	}

	network.awayMessage = reason;

	this.save();
};

export default {
	commands,
	input,
};
