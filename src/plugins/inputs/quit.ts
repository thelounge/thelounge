"use strict";

import _ from "lodash";
import Chan from "src/models/chan";
import Network from "src/models/network";
import ClientCertificate from "../clientCertificate";

const commands = ["quit"];
const allowDisconnected = true;

const input = function (network: Network, chan: Chan, cmd: string, args: string[]) {
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

export default {
	commands,
	input,
	allowDisconnected,
};
