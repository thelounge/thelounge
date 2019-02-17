"use strict";

const Msg = require("../../models/msg");
const Chan = require("../../models/chan");

exports.commands = ["cycle", "rejoin"];

exports.input = function({irc}, chan) {
	if (chan.type !== Chan.Type.CHANNEL) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: "You can only rejoin channels.",
			})
		);
		return;
	}

	irc.part(chan.name, "Rejoining");
	irc.join(chan.name);

	return true;
};
