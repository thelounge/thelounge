exports.commands = ["shrug", "slap", "me"];

exports.input = function (network, chan, cmd, args) {
	var irc = network.irc;
	var text;

	switch (cmd) {
	case "shrug":
		text = "¯\\_(ツ)_/¯ " + args.join(" ");
		handleMe(text);
		break;
	case "slap":
		text = "slaps " + args[0] + " around a bit with a large trout";
		handleMe(text);
		break;
	case "me":
		if (args.length === 0) {
			break;
		}

		text = text || args.join(" ");
		handleMe(text);
		break;
	}

	return true;
	function handleMe(text) {
		irc.action(chan.name, text);

		if (!network.irc.network.cap.isEnabled("echo-message")) {
			irc.emit("action", {
				nick: irc.user.nick,
				target: chan.name,
				message: text
			});
		}
	}
};
