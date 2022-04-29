"use strict";
const Msg = require("../../models/msg");

exports.commands = ["whois", "whowas"];

exports.input = function ({irc}, chan, cmd, args) {
	const client = this;
	const target = args[0];
	const targetNick = args[1] ? args[1] : target;

	const sendToClient = (data) => {
		if (data.error) {
			chan.pushMessage(
				client,
				new Msg({
					type: Msg.Type.ERROR,
					error: data.error,
					nick: targetNick,
				})
			);
		} else {
			// Absolute datetime in milliseconds since nick is idle
			data.idleTime = Date.now() - data.idle * 1000;
			// Absolute datetime in milliseconds when nick logged on.
			data.logonTime = data.logon * 1000;
			chan.pushMessage(
				client,
				new Msg({
					type: Msg.Type.WHOIS,
					whois: data,
				})
			);
		}
	};

	switch (cmd) {
		case "whois":
			irc.whois(target, targetNick, sendToClient);
			break;
		case "whowas":
			irc.whowas(target, (data) => {
				data.whowas = true;
				sendToClient(data);
			});
			break;
	}
};
