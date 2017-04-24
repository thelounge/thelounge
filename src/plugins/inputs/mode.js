"use strict";

var Chan = require("../../models/chan");
var Msg = require("../../models/msg");

exports.commands = [
	"banlist",
	"mode",
	"op",
	"deop",
	"hop",
	"dehop",
	"voice",
	"devoice",
];

const chanCommands = [
	"banlist"
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

		if (args.length === 0 && chanCommands.indexOf(cmd) === -1) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: `Usage: /${cmd} <nick> [...nick]`
			}));

			return;
		}

		const mode = {
			banlist: "+b",
			op: "+o",
			hop: "+h",
			voice: "+v",
			deop: "-o",
			dehop: "-h",
			devoice: "-v"
		}[cmd];

		if (chanCommands.indexOf(cmd) > -1 && args.length === 0) {
			network.irc.raw("MODE", chan.name, mode);
		}
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
