"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

exports.commands = [
	"mode",
	"op",
	"deop",
	"hop",
	"dehop",
	"voice",
	"devoice",
];

exports.input = function(network, chan, cmd, args) {
	if (cmd !== "mode") {
		if (chan.type !== Chan.Type.CHANNEL) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: `${cmd} command can only be used in channels.`
			}));

			return;
		}

		if (args.length === 0) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: `Usage: /${cmd} <nick> [...nick]`
			}));

			return;
		}

		const mode = {
			op: "+o",
			hop: "+h",
			voice: "+v",
			deop: "-o",
			dehop: "-h",
			devoice: "-v"
		}[cmd];

		args.forEach(function(target) {
			network.irc.raw("MODE", chan.name, mode, target);
		});

		return;
	}

	if (args.length === 0 || args[0][0] === "+" || args[0][0] === "-") {
		args.unshift(chan.type === Chan.Type.CHANNEL || chan.type === Chan.Type.QUERY ? chan.name : network.nick);
	}

	args.unshift("MODE");

	network.irc.raw.apply(network.irc, args);
};
