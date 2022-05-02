"use strict";

import Chan from "src/models/chan";
import Network from "src/models/network";

const commands = ["kill"];

const input = function ({irc}: Network, chan: Chan, cmd: string, args: string[]) {
	if (args.length !== 0) {
		irc.raw("KILL", args[0], args.slice(1).join(" "));
	}

	return true;
};

export default {
	commands,
	input,
};
