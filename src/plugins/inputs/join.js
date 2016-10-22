"use strict";

var Chan = require("../../models/chan");

exports.commands = ["join"];

exports.input = function(network, chan, cmd, args) {
	if (args.length !== 0) {
		var irc = network.irc;
		irc.join(args[0], args[1]);
	}
	var newChan = new Chan({
		type: Chan.Type.CHANNEL,
		name: args[0],
		key: args[1],
	});
	network.channels.push(newChan);
	this.emit("join", {
		network: network.id,
		chan: newChan
	});
	this.save();
	return true;
};
