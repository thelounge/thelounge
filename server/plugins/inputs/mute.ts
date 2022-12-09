import Chan from "../../models/chan";
import Network from "../../models/network";
import {PluginInputHandler} from "./index";

import Msg, {MessageType} from "../../models/msg";

import Client from "../../client";

const commands = ["mute", "unmute"];
const allowDisconnected = true;

function args_to_channels(network: Network, args: string[]) {
	const targets: Chan[] = [];

	for (const arg of args) {
		const target = network.channels.find((c) => c.name === arg);

		if (target) {
			targets.push(target);
		}
	}

	return targets;
}

function change_mute_state(client: Client, target: Chan, valueToSet: boolean) {
	if (target.type === "special") {
		return;
	}

	target.setMuteStatus(valueToSet);
	client.emit("mute:changed", {
		target: target.id,
		status: valueToSet,
	});
}

const input: PluginInputHandler = function (network, chan, cmd, args) {
	const valueToSet = cmd === "mute" ? true : false;
	const client = this;

	if (args.length === 0) {
		change_mute_state(client, chan, valueToSet);
		return;
	}

	const targets = args_to_channels(network, args);

	if (targets.length !== args.length) {
		const targetNames = targets.map((ch) => ch.name);
		const missing = args.filter((x) => !targetNames.includes(x));
		chan.pushMessage(
			client,
			new Msg({
				type: MessageType.ERROR,
				text: `No open ${
					missing.length === 1 ? "channel or user" : "channels or users"
				} found for ${missing.join(",")}`,
			})
		);
		return;
	}

	for (const target of targets) {
		change_mute_state(client, target, valueToSet);
	}
};

export default {
	commands,
	input,
	allowDisconnected,
};
