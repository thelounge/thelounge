"use strict";

const _ = require("lodash");
const Helper = require("../../helper");

exports.commands = ["quit"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	const client = this;

	client.networks = _.without(client.networks, network);
	network.destroy();
	client.save();
	client.emit("quit", {
		network: network.uuid,
	});

	if (network.irc) {
		const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;
		network.irc.quit(quitMessage);
	}

	return true;
};
