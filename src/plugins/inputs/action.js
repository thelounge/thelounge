exports.commands = ["slap", "me"];

exports.input = function(network, chan, cmd, args) {
	var irc = network.irc;

	switch (cmd) {
	case "slap":
		var slap = "slaps " + args[0] + " around a bit with a large trout";
		/* fall through */
	case "me":
		if (args.length === 0) {
			break;
		}

		var text = slap || args.join(" ");
		irc.action(
			chan.name,
			text
		);
		irc.emit("message", {
			from: irc.me,
			to: chan.name,
			message: "\u0001ACTION " + text
		});
		break;
	}

	return true;
};
