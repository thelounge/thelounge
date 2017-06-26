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
				translate: true,
				text: "server.error.already_connected",
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

	this.connect({
		host: args[0],
		port: port,
		tls: tls,
	});

	return true;
};
