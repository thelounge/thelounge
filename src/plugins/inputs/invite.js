module.exports = function(network, chan, cmd, args) {
	if (cmd !== "invite") {
		return;
	}
	var irc = network.irc;
	if (args.length === 2) {
		irc.invite(args[0], args[1]);
	}
};
