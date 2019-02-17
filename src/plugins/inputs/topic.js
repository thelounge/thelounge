"use strict";

const Chan = require("../../models/chan");
const Msg = require("../../models/msg");

exports.commands = ["topic"];

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

	irc.setTopic(chan.name, args.join(" "));
	return true;
};
