"use strict";

import Chan from "src/models/chan";
import Network from "src/models/network";

const commands = ["raw", "send", "quote"];

const input = function ({irc}: Network, chan: Chan, cmd: string, args: string[]) {
	if (args.length !== 0) {
		irc.connection.write(args.join(" "));
	}

	return true;
};

export default {
	commands,
	input,
};
