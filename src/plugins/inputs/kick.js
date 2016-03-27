exports.commands = ["kick"];

exports.input = function(network, chan, cmd, args) {
	if (args.length !== 0) {
		var irc = network.irc;
		irc.raw("KICK", chan.name, args[0], args.slice(1).join(" "));
	}

	return true;
};
