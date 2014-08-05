var _ = require("lodash");

module.exports = function(network, chan, cmd, args) {
	if (cmd != "quit" && cmd != "disconnect") {
		return;
	}
	
	var client = this;
	var irc = network.irc;
	
	client.networks = _.without(client.networks, network);
	client.emit("quit", {
		network: network.id
	});
	
	irc.quit();
};
