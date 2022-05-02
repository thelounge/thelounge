"use strict";

import Chan from "src/models/chan";
import Network from "src/models/network";

const commands = ["disconnect"];
const allowDisconnected = true;

const input = function (network: Network, chan: Chan, cmd: string, args: string[]) {
	const quitMessage = args[0] ? args.join(" ") : null;

	network.quit(quitMessage);
	network.userDisconnected = true;

	this.save();
};

export default {
	commands,
	input,
	allowDisconnected,
};
