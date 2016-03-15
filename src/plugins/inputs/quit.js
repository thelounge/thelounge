var _ = require("lodash");

exports.commands = ["quit", "disconnect"];

exports.input = function(network, chan, cmd, args) {
	var client = this;
	var irc = network.irc;
	var quitMessage = args[0] ? args.join(" ") : "";

	client.networks = _.without(client.networks, network);
	client.save();
	client.emit("quit", {
		network: network.id
	});

	irc.quit(quitMessage);

	return true;
};
