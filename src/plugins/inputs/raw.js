"use strict";

exports.commands = ["raw", "send", "quote"];

exports.input = function({irc}, chan, cmd, args) {
	if (args.length !== 0) {
		irc.raw(args);
	}

	return true;
};
