import _ from "lodash";

import {PluginInputHandler} from "./index";
import ClientCertificate from "../clientCertificate";

const commands = ["quit"];
const allowDisconnected = true;

const input: PluginInputHandler = function (network, chan, cmd, args) {

	this.networks = _.without(this.networks, network);
	network.destroy();
	this.save();
	this.emit("quit", {
		network: network.uuid,
	});

	const quitMessage = args[0] ? args.join(" ") : undefined;
	network.quit(quitMessage);

	ClientCertificate.remove(network.uuid);

	return true;
};

export default {
	commands,
	input,
	allowDisconnected,
};
