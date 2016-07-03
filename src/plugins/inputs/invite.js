var Chan = require("../../models/chan");

exports.commands = ["invite"];

exports.input = function(network, chan, cmd, args) {
	var irc = network.irc;

	if (args.length === 2) {
		irc.raw("INVITE", args[0], args[1]); // Channel provided in the command
	}	else if (args.length === 1 && chan.type === Chan.Type.CHANNEL) {
		irc.raw("INVITE", args[0], chan.name); // Current channel
	}

	return true;
};
