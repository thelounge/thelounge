module.exports = function(network, chan, cmd, args) {
	if (cmd != "whois" && cmd != "query") {
		return;
	}
	if (args.length !== 0) {
		var irc = network.irc;
		irc.whois(args[0]);
	}
};
