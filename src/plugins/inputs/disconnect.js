exports.commands = ["disconnect"];

exports.input = function(network, chan, cmd, args) {
	var quitMessage = args[0] ? args.join(" ") : "";

	network.irc.quit(quitMessage);
};
