module.exports = function(network, chan, cmd, args) {
	if (cmd != "kick") {
		return;
	}
	if (args.length !== 0) {
		var irc = network.irc;
		irc.kick(chan.name, args[0]);
	}
};
