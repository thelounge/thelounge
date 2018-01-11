"use strict";

const Msg = require("../../models/msg");

exports.commands = ["nick"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0) {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: "Usage: /nick <your new nick>",
		}));
		return;
	}

	if (args.length !== 1) {
		chan.pushMessage(this, new Msg({
			type: Msg.Type.ERROR,
			text: "Nicknames may not contain spaces.",
		}));
		return;
	}

	const newNick = args[0];

	// If connected to IRC, send to server and wait for ACK
	// otherwise update the nick and UI straight away
	if (network.irc && network.irc.connection) {
		network.irc.raw("NICK", newNick);
	} else {
		network.setNick(newNick);

		this.emit("nick", {
			network: network.id,
			nick: newNick,
		});
	}
};
