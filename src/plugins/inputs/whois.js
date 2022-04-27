"use strict";
const Msg = require("../../models/msg");

exports.commands = ["whois", "whowas"];

exports.input = function ({irc}, chan, cmd, args) {
	const client = this;
	const target = args[0];
	const targetNick = args[1] ? args[1] : target;

	const sendToClient = (data) => {
		if (data.error) {
			// no-op, the server will send an error handled by components/MessageTypes/error.vue
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

	if (cmd === "whois") {
		irc.whois(targetNick, (data) => {
			sendToClient(data);
		});
	} else if (cmd === "whowas") {
		irc.whowas(targetNick, (data) => {
			data.whowas = true;
			sendToClient(data);
		});
	}
};
