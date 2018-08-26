"use strict";

const Helper = require("../../helper");

exports.commands = ["disconnect"];

exports.input = function(network, chan, cmd, args) {
	const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;

	network.irc.quit(quitMessage);

	network.userDisconnected = true;
	this.save();
};
