"use strict";

var Msg = require("../../models/msg");

exports.commands = ["connect", "server"];
exports.allowDisconnected = true;

exports.input = function({irc}, chan, cmd, args) {
	if (args.length === 0) {
		if (!irc || !irc.connection) {
			return;
		}

		if (irc.connection.connected) {
			chan.pushMessage(this, new Msg({
				type: Msg.Type.ERROR,
				text: "You are already connected.",
			}));
			return;
		}

		irc.connection.connect();

		return;
	}

	var port = args[1] || "";
	var tls = port[0] === "+";

	if (tls) {
		port = port.substring(1);
	}

	this.connect({
		host: args[0],
		port: port,
		tls: tls,
	});

	return true;
};
