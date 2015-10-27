module.exports = function(network, chan, cmd, args) {
	if (cmd !== "nick") {
		return;
	}
	if (args.length !== 0) {
		var irc = network.irc;
		irc.nick(args[0]);
	}
};
