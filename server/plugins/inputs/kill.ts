import {PluginInputHandler} from "./index";

const commands = ["kill"];

const input: PluginInputHandler = function ({irc}, chan, cmd, args) {
	if (args.length !== 0) {
		irc.raw("KILL", args[0], args.slice(1).join(" "));
	}

	return true;
};

export default {
	commands,
	input,
};
