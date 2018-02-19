"use strict";

exports.commands = ["ctcp"];

exports.input = function({irc}, chan, cmd, args) {
	if (args.length > 1) {
		irc.ctcpRequest(args[0], args.slice(1).join(" "));
	}
};
