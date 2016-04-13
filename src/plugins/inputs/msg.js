exports.commands = ["msg", "say"];

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0 || args[0] === "") {
		return true;
	}

	var irc = network.irc;
	var target = "";
	if (cmd === "msg") {
		target = args.shift();
		if (args.length === 0) {
			return true;
		}
	} else {
		target = chan.name;
	}

	var msg = args.join(" ");
	irc.say(target, msg);

	var channel = network.getChannel(target);
	if (typeof channel !== "undefined") {
		irc.emit("privmsg", {
			nick: irc.user.nick,
			target: channel.name,
			message: msg
		});
	}

	return true;
};
