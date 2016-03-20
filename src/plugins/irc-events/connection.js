var _ = require("lodash");
var identd = require("../../identd");
var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	client.emit("msg", {
		chan: network.channels[0].id,
		msg: new Msg({
			text: "Network created, connecting to " + network.host + ":" + network.port + "..."
		})
	});

	irc.on("raw socket connected", function() {
		identd.hook(irc.connection.socket, network.username);
	});

	irc.on("socket connected", function() {
		client.emit("msg", {
			chan: network.channels[0].id,
			msg: new Msg({
				text: "Connected to the network."
			})
		});
	});

	irc.on("socket close", function() {
		client.emit("msg", {
			chan: network.channels[0].id,
			msg: new Msg({
				text: "Disconnected from the network."
			})
		});
	});

	irc.on("socket error", function(err) {
		console.log(err);
		client.emit("msg", {
			chan: network.channels[0].id,
			msg: new Msg({
				type: Msg.Type.ERROR,
				text: "Socket error: " + err
			})
		});
	});

	irc.on("reconnecting", function() {
		client.emit("msg", {
			chan: network.channels[0].id,
			msg: new Msg({
				text: "Reconnecting..."
			})
		});
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
