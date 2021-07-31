"use strict";
const Msg = require("../../models/msg");

exports.commands = ["mute", "unmute"];

exports.input = function (network, chan, cmd, args) {
	const valueToSet = cmd === "mute" ? true : false;

	if (args.length === 0) {
		chan.setMuteStatus(valueToSet);
	} else if (args.length > 1) {
		const targets = [];

		for (const arg of args) {
			const target = network.channels.find((c) => c.name === arg);

			if (target) {
				targets.push(target);
			}
		}

		if (targets.length === args.length) {
			for (const target of targets) {
				target.setMuteStatus(valueToSet);
			}
		} else {
			const missing = targets.filter((x) => !args.includes(x));
			chan.pushMessage(
				this,
				new Msg({
					type: Msg.Type.ERROR,
					text: `No open ${
						args.length - targets.length === 1 ? "change" : "changes"
					} found for ${missing.join(",")}`,
				})
			);

			return;
		}
	}

	return true;
};
