const commands = ["away", "back"];
import {PluginInputHandler} from "./index";

const input: PluginInputHandler = function (network, chan, cmd, args) {
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
