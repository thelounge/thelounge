exports.commands = ["join"];

exports.input = function(network, chan, cmd, args) {
	if (args.length !== 0) {
		var irc = network.irc;
		irc.join(args[0], args[1]);
	}

	return true;
};
