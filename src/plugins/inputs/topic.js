exports.commands = ["topic"];

exports.input = function(network, chan, cmd, args) {
	var irc = network.irc;
	irc.raw("TOPIC", chan.name, args.join(" "));

	return true;
};
