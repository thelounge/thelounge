var _ = require("lodash");

module.exports = function(network, chan, cmd, args) {
	if (cmd !== "part" && cmd !== "leave" && cmd !== "close") {
		return;
	}

	if (chan.type !== "query") {
		var irc = network.irc;
		if (args.length === 0) {
			args.push(chan.name);
		}
		irc.part(args);
	}

	network.channels = _.without(network.channels, chan);
	this.emit("part", {
		chan: chan.id
	});

	return true;
};
