"use strict";

exports.commands = ["raw", "send", "quote"];

exports.input = function({irc}, chan, cmd, args) {
	if (args.length !== 0) {
		irc.connection.write(args.join(" "));
	}

	return true;
};
