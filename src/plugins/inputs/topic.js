exports.commands = ["topic"];

exports.input = function(network, chan, cmd, args) {
	var msg = chan.name;
	msg += args[0] ? (" :" + args.join(" ")) : "";

	var irc = network.irc;
	irc.raw("TOPIC", msg);

	return true;
};
