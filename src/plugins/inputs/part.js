var _ = require("lodash");

module.exports = function(network, chan, cmd, args) {
	if (cmd !== "part" && cmd !== "leave" && cmd !== "close") {
		return;
	}
	var client = this;
	if (chan.type === "query") {
		network.channels = _.without(network.channels, chan);
		client.emit("part", {
			chan: chan.id
		});
	} else {
		var irc = network.irc;
		if (args.length === 0) {
			args.push(chan.name);
		}
		irc.part(args);
	}
};
