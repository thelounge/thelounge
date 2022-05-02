"use strict";

const _ = require("lodash");
const ClientCertificate = require("../clientCertificate");

exports.commands = ["quit"];
exports.allowDisconnected = true;

exports.input = function (network, chan, cmd, args) {
	const client = this;

	client.networks = _.without(client.networks, network);
	network.destroy();
	client.save();
	client.emit("quit", {
		network: network.uuid,
	});

	const quitMessage = args[0] ? args.join(" ") : null;
	network.quit(quitMessage);

	ClientCertificate.remove(network.uuid);

	return true;
};
