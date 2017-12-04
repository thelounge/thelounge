"use strict";

var _ = require("lodash");
var Msg = require("../../models/msg");
var Chan = require("../../models/chan");
const Helper = require("../../helper");

exports.commands = ["close", "leave", "part"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	let target = args.length === 0 ? chan : _.find(network.channels, {name: args[0]});
	let partMessage = args.length <= 1 ? Helper.config.leaveMessage : args.slice(1).join(" ");

	if (typeof target === "undefined") {
		// In this case, we assume that the word args[0] is part of the leave
		// message and we part the current chan.
		target = chan;
		partMessage = args.join(" ");
	}

	if (target.type === Chan.Type.LOBBY) {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: "You can not part from networks, use /quit instead.",
		}));
		return;
	}

	network.channels = _.without(network.channels, target);
	target.destroy();
	this.emit("part", {
		chan: target.id,
	});

	if (target.type === Chan.Type.CHANNEL) {
		this.save();

		if (network.irc) {
			network.irc.part(target.name, partMessage);
		}
	}

	return true;
};
