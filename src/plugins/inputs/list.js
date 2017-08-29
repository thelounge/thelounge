"use strict";

exports.commands = ["list"];

exports.input = function(network, chan, cmd, args) {
	network.chanCache = [];
	network.irc.list.apply(network.irc, args);
	return true;
};
