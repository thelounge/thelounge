exports.commands = ["topic"];

exports.input = function(network, chan, cmd, args) {
	var msg = "TOPIC";
	msg += " " + chan.name;
	msg += args[0] ? (" :" + args.join(" ")) : "";

	var irc = network.irc;
	irc.write(msg);

	return true;
};
