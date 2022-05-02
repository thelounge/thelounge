"use strict";

import Chan from "src/models/chan";
import Network from "src/models/network";

const commands = ["list"];

const input = function (network: Network, chan: Chan, cmd: string, args: string[]) {
	network.chanCache = [];
	network.irc.list(...args);
	return true;
};

export default {
	commands,
	input,
};
