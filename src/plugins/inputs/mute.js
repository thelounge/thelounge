"use strict";
const Msg = require("../../models/msg");

exports.commands = ["mute", "unmute"];

function args_to_channels(network, args) {
	const targets = [];

	for (const arg of args) {
		const target = network.channels.find((c) => c.name === arg);

		if (target) {
			targets.push(target);
		}
	}

	return targets;
}

function change_mute_state(client, target, valueToSet) {
	if (target.type === "special") {
		return;
	}

	target.setMuteStatus(valueToSet);
	client.emit("mute:changed", {
		target: target.id,
		status: valueToSet,
	});
}

exports.input = function (network, chan, cmd, args) {
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
				type: Msg.Type.ERROR,
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
