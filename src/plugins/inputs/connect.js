exports.commands = ["connect", "server"];

exports.input = function(network, chan, cmd, args) {
	if (args.length !== 0) {
		var client = this;
		client.connect({
			host: args[0]
		});
	}

	return true;
};
