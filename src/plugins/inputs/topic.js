module.exports = function(network, chan, cmd, args) {
	if (cmd !== "topic") {
		return;
	}

	var msg = "TOPIC";
	msg += " " + chan.name;
	msg += args[0] ? (" :" + args.join(" ")) : "";

	var irc = network.irc;
	irc.write(msg);
};
