"use strict";

const Helper = require("../../helper");

exports.commands = ["disconnect"];

exports.input = function(network, chan, cmd, args) {
	var quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;

	network.irc.quit(quitMessage);
};
