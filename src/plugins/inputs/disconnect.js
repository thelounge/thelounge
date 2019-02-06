"use strict";

const Helper = require("../../helper");

exports.commands = ["disconnect"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;

	// Even if we are disconnected, but there is an internal connection object
	// pass the quit/end to it, so the reconnection timer stops
	if (network.irc && network.irc.connection) {
		network.irc.quit(quitMessage);
	}

	network.userDisconnected = true;
	this.save();
};
