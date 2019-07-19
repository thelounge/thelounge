"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

exports.commands = ["slap", "me"];

exports.input = function({irc}, chan, cmd, args) {
	if (chan.type !== Chan.Type.CHANNEL && chan.type !== Chan.Type.QUERY) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: `${cmd} command can only be used in channels and queries.`,
			})
		);

		return;
	}

	let text;

	switch (cmd) {
		case "slap":
			text = "slaps " + args[0] + " around a bit with a large trout";
		/* fall through */
		case "me":
			if (args.length === 0) {
				break;
			}

			text = text || args.join(" ");

			irc.action(chan.name, text);

			if (!irc.network.cap.isEnabled("echo-message")) {
				irc.emit("action", {
					nick: irc.user.nick,
					target: chan.name,
					message: text,
				});
			}

			break;
	}

	return true;
};
