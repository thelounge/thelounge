exports.commands = ["kick"];

exports.input = function(network, chan, cmd, args) {
	if (args.length !== 0) {
		var irc = network.irc;
		irc.kick(chan.name, args[0]);
	}

	return true;
};
