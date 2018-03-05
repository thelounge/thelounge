"use strict";

const Msg = require("../../models/msg");

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

	let port = args[1] || "";
	const tls = port[0] === "+";

	if (tls) {
		port = port.substring(1);
	}

	const host = args[0];
	this.connect({host, port, tls});

	return true;
};
