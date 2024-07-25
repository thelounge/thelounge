import {PluginInputHandler} from "./index";

const commands = ["raw", "send", "quote"];

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
	if (args.length !== 0) {
		irc.raw(...args);
	}

	return true;
};

export default {
	commands,
	input,
};
