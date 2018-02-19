"use strict";

const Helper = require("../../helper");

exports.commands = ["disconnect"];

exports.input = function({irc}, chan, cmd, args) {
	const quitMessage = args[0] ? args.join(" ") : Helper.config.leaveMessage;

	irc.quit(quitMessage);
};
