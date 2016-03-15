exports.commands = ["mode", "op", "voice", "deop", "devoice"];

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0) {
		return;
	}

	var mode;
	var user;
	if (cmd !== "mode") {
		user = args[0];
		mode = {
			"op": "+o",
			"voice": "+v",
			"deop": "-o",
			"devoice": "-v"
		}[cmd];
	} else if (args.length === 1) {
		return true;
	} else {
		mode = args[0];
		user = args[1];
	}
	var irc = network.irc;
	irc.mode(
		chan.name,
		mode,
		user
	);

	return true;
};
