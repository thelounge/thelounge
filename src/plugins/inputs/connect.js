var Msg = require("../../models/msg");

exports.commands = ["connect", "server"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0) {
		if (!network.irc || !network.irc.connection) {
			return;
		}

		if (network.irc.connection.connected) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "You are already connected."
			}));
			return;
		}

		network.irc.connection.connect();

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
