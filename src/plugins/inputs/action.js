exports.commands = ["slap", "me"];

exports.input = function(network, chan, cmd, args) {
	var irc = network.irc;
	var text;

	switch (cmd) {
	case "slap":
		text = "slaps " + args[0] + " around a bit with a large trout";
		/* fall through */
	case "me":
		if (args.length === 0) {
			break;
		}

		text = text || args.join(" ");

		irc.say(chan.name, "\u0001ACTION " + text + "\u0001");
		irc.emit("action", {
			nick: irc.user.nick,
			target: chan.name,
			message: text
		});
		break;
	}

	return true;
};
