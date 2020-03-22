"use strict";

exports.commands = ["disconnect"];
exports.allowDisconnected = true;

exports.input = function (network, chan, cmd, args) {
	const quitMessage = args[0] ? args.join(" ") : null;

	network.quit(quitMessage);
	network.userDisconnected = true;

	this.save();
};
