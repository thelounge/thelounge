module.exports = function(network, chan, cmd, args) {
	if (cmd != "part") {
		return;
	}
	var irc = network.irc;
	if (args.length === 0) {
		args.push("#" + chan.name);
	}
	irc.part(args);
};
