import {PluginInputHandler} from "./index";

const commands = ["disconnect"];
const allowDisconnected = true;

const input: PluginInputHandler = function (network, chan, cmd, args) {
	const quitMessage = args[0] ? args.join(" ") : undefined;

	network.quit(quitMessage);
	network.userDisconnected = true;

	this.save();
};

export default {
	commands,
	input,
	allowDisconnected,
};
