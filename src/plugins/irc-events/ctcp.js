"use strict";

const Helper = require("../../helper");
const Msg = require("../../models/msg");
const pkg = require("../../../package.json");

const ctcpResponses = {
	CLIENTINFO: () => Object // TODO: This is currently handled by irc-framework
		.getOwnPropertyNames(ctcpResponses)
		.filter((key) => key !== "CLIENTINFO" && typeof ctcpResponses[key] === "function")
		.join(" "),
	PING: ({message}) => message.substring(5),
	SOURCE: () => pkg.repository.url,
	VERSION: () => pkg.name + " " + Helper.getVersion() + " -- " + pkg.homepage,
};

module.exports = function(irc, network) {
	const client = this;

	irc.on("ctcp response", function(data) {
		let chan = network.getChannel(data.nick);

		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		const msg = new Msg({
			type: Msg.Type.CTCP,
			time: data.time,
			from: chan.getUser(data.nick),
			ctcpType: data.type,
			ctcpMessage: data.message,
		});
		chan.pushMessage(client, msg);
	});

	irc.on("ctcp request", (data) => {
		const response = ctcpResponses[data.type];

		if (response) {
			irc.ctcpResponse(data.nick, data.type, response(data));
		}
	});
};
