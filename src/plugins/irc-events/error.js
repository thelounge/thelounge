"use strict";

const Msg = require("../../models/msg");
const Helper = require("../../helper");

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

		const msg = new Msg({
			type: Msg.Type.ERROR,
			text: text,
			showInActive: true,
		});

		let target = network.channels[0];

		// If this error is channel specific and a channel
		// with this name exists, put this error in that channel
		if (data.channel) {
			const channel = network.getChannel(data.channel);

			if (typeof channel !== "undefined") {
				target = channel;
				msg.showInActive = false;
			}
		}

		target.pushMessage(client, msg, true);
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
			network: network.uuid,
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
			irc.changeNick(Helper.getDefaultNick());
		}

		client.emit("nick", {
			network: network.uuid,
			nick: irc.user.nick,
		});
	});
};
