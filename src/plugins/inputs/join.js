module.exports = function(network, chan, cmd, args) {
	if (cmd !== "join") {
		return;
	}
	if (args.length !== 0) {
		var irc = network.irc;
		irc.join(args[0], args[1]);
	}
};
