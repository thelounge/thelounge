"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

exports.commands = ["ban", "unban", "banlist"];

exports.input = function({irc}, chan, cmd, args) {
	if (chan.type !== Chan.Type.CHANNEL) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: `${cmd} command can only be used in channels.`,
			})
		);

		return;
	}

	if (cmd !== "banlist" && args.length === 0) {
		if (args.length === 0) {
			chan.pushMessage(
				this,
				new Msg({
					type: Msg.Type.ERROR,
					text: `Usage: /${cmd} <nick>`,
				})
			);

			return;
		}
	}

	switch (cmd) {
		case "ban":
			irc.ban(chan.name, args[0]);
			break;
		case "unban":
			irc.unban(chan.name, args[0]);
			break;
		case "banlist":
			irc.banlist(chan.name);
			break;
	}
};
