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

	if (args.length > 0) {
		// We construct a command manually because we want to allow clearing a topic when sending "/topic "
		// and irc-framework's "raw" function wouldn't put a colon for an empty argument
		irc.connection.write(`TOPIC ${chan.name} :${args.join(" ")}`);
	} else {
		irc.raw("TOPIC", chan.name);
	}

	return true;
};
