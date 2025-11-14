import {PluginInputHandler} from "./index.js";

const commands = ["list"];

const input: PluginInputHandler = function (network, chan, cmd, args) {
	network.chanCache = [];
	network.irc.list(...args);
	return true;
};

export default {
	commands,
	input,
};
