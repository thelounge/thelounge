module.exports = function(network, chan, cmd, args) {
	if (cmd !== "raw" && cmd !== "send" && cmd !== "quote") {
		return;
	}
	if (args.length !== 0) {
		var irc = network.irc;
		irc.write(args.join(" "));
	}
};
