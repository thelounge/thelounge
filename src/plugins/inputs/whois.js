exports.commands = ["query", "whois"];

exports.input = function(network, chan, cmd, args) {
	if (args.length !== 0) {
		var irc = network.irc;
		irc.whois(args[0]);
	}

	return true;
};
