"use strict";

const Msg = require("../../models/msg");

exports.commands = ["nick"];
exports.allowDisconnected = true;

exports.input = function(network, chan, cmd, args) {
	if (args.length === 0) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: "Usage: /nick <your new nick>",
			})
		);
		return;
	}

	if (args.length !== 1) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: "Nicknames may not contain spaces.",
			})
		);
		return;
	}

	const newNick = args[0];

	if (newNick.length > 100) {
		chan.pushMessage(
			this,
			new Msg({
				type: Msg.Type.ERROR,
				text: "Nicknames may not be this long.",
			})
		);
		return;
	}

	// If we were trying to keep a nick and user changes nick, stop trying to keep the old one
	network.keepNick = null;

	// If connected to IRC, send to server and wait for ACK
	// otherwise update the nick and UI straight away
	if (network.irc) {
		if (network.irc.connection && network.irc.connection.connected) {
			network.irc.changeNick(newNick);

			return;
		}

		network.irc.options.nick = network.irc.user.nick = newNick;
	}

	network.setNick(newNick);

	this.emit("nick", {
		network: network.uuid,
		nick: newNick,
	});

	this.save();
};
