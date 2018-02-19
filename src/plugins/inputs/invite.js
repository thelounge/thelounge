"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

exports.commands = ["invite"];

exports.input = function({irc}, chan, cmd, args) {
	if (args.length === 2) {
		irc.raw("INVITE", args[0], args[1]); // Channel provided in the command
	}	else if (args.length === 1 && chan.type === Chan.Type.CHANNEL) {
		irc.raw("INVITE", args[0], chan.name); // Current channel
	} else {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: `${cmd} command can only be used in channels or by specifying a target.`,
		}));
	}
};
