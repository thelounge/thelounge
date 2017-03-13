"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

exports.commands = ["topic"];

exports.input = function(network, chan, cmd, args) {
	if (chan.type !== Chan.Type.CHANNEL) {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: `${cmd} command can only be used in channels.`
		}));

		return;
	}

	var irc = network.irc;
	irc.raw("TOPIC", chan.name, args.join(" "));

	return true;
};
