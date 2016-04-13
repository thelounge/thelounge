exports.commands = ["connect", "server"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0) {
		return;
	}

	var port = args[1] || "";
	var tls = port[0] === "+";

	if (tls) {
		port = port.substring(1);
	}

	this.connect({
		host: args[0],
		port: port,
		tls: tls,
	});

	return true;
};
