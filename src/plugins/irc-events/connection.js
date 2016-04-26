var _ = require("lodash");
var identd = require("../../identd");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	network.channels[0].pushMessage(client, new Msg({
		text: "Network created, connecting to " + network.host + ":" + network.port + "..."
	}));

	irc.on("socket connected", function() {
		network.channels[0].pushMessage(client, new Msg({
			text: "Connected to the network."
		}));
	});

	irc.on("close", function() {
		network.channels[0].pushMessage(client, new Msg({
			text: "Disconnected from the network, and will not reconnect."
		}));
	});

	if (identd.isEnabled()) {
		irc.on("socket connected", function() {
			identd.hook(irc.connection.socket, client.name || network.username);
		});
	}

	irc.on("socket error", function(err) {
		log.debug("IRC socket error", err);
		network.channels[0].pushMessage(client, new Msg({
			type: Msg.Type.ERROR,
			text: "Socket error: " + err
		}));
	});

	irc.on("reconnecting", function() {
		network.channels[0].pushMessage(client, new Msg({
			text: "Disconnected from the network. Reconnecting..."
		}));
	});

	irc.on("ping timeout", function() {
		network.channels[0].pushMessage(client, new Msg({
			text: "Ping timeout, disconnecting..."
		}));
	});

	irc.on("server options", function(data) {
		if (network.serverOptions.PREFIX === data.options.PREFIX) {
			return;
		}

		network.prefixLookup = {};

		_.each(data.options.PREFIX, function(mode) {
			network.prefixLookup[mode.mode] = mode.symbol;
		});

		network.serverOptions.PREFIX = data.options.PREFIX;

		client.emit("network_changed", {
			network: network.id,
			serverOptions: network.serverOptions
		});
	});
};
