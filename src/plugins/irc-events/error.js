"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("irc error", function(data) {
		let text = "";

		if (data.channel) {
			text = `${data.channel}: `;
		}

		if (data.error === "user_on_channel") {
			text += `User (${data.nick}) is already on channel`;
		} else if (data.reason) {
			text += `${data.reason} (${data.error})`;
		} else {
			text += data.error;
		}

		const lobby = network.channels[0];
		const msg = new Msg({
			type: Msg.Type.ERROR,
			text: text,
			showInActive: true,
		});
		lobby.pushMessage(client, msg, true);
	});

	irc.on("nick in use", function(data) {
		const lobby = network.channels[0];
		const msg = new Msg({
			type: Msg.Type.ERROR,
			text: data.nick + ": " + (data.reason || "Nickname is already in use."),
			showInActive: true,
		});
		lobby.pushMessage(client, msg, true);

		if (irc.connection.registered === false) {
			const random = (data.nick || irc.user.nick) + Math.floor(Math.random() * 10);
			irc.changeNick(random);
		}

		client.emit("nick", {
			network: network.id,
			nick: irc.user.nick,
		});
	});

	irc.on("nick invalid", function(data) {
		const lobby = network.channels[0];
		const msg = new Msg({
			type: Msg.Type.ERROR,
			text: data.nick + ": " + (data.reason || "Nickname is invalid."),
			showInActive: true,
		});
		lobby.pushMessage(client, msg, true);

		if (irc.connection.registered === false) {
			irc.changeNick("thelounge" + Math.floor(Math.random() * 100));
		}

		client.emit("nick", {
			network: network.id,
			nick: irc.user.nick,
		});
	});
};
