"use strict";

const _ = require("lodash");
const Helper = require("../../helper");
const Msg = require("../../models/msg");
const User = require("../../models/user");
const pkg = require("../../../package.json");

const ctcpResponses = {
	CLIENTINFO: () =>
		Object.getOwnPropertyNames(ctcpResponses) // TODO: This is currently handled by irc-framework
			.filter((key) => key !== "CLIENTINFO" && typeof ctcpResponses[key] === "function")
			.join(" "),
	PING: ({message}) => message.substring(5),
	SOURCE: () => pkg.repository.url,
	VERSION: () => pkg.name + " " + Helper.getVersion() + " -- " + pkg.homepage,
};

module.exports = function(irc, network) {
	const client = this;
	const lobby = network.channels[0];

	irc.on("ctcp response", function(data) {
		const shouldIgnore = network.ignoreList.some(function(entry) {
			return Helper.compareHostmask(entry, data);
		});

		if (shouldIgnore) {
			return;
		}

		let chan = network.getChannel(data.nick);

		if (typeof chan === "undefined") {
			chan = lobby;
		}

		const msg = new Msg({
			type: Msg.Type.CTCP,
			time: data.time,
			from: chan.getUser(data.nick),
			ctcpMessage: data.message,
		});
		chan.pushMessage(client, msg, true);
	});

	// Limit requests to a rate of one per second max
	irc.on(
		"ctcp request",
		_.throttle(
			(data) => {
				const shouldIgnore = network.ignoreList.some(function(entry) {
					return Helper.compareHostmask(entry, data);
				});

				if (shouldIgnore) {
					return;
				}

				const response = ctcpResponses[data.type];

				if (response) {
					irc.ctcpResponse(data.nick, data.type, response(data));
				}

				// Let user know someone is making a CTCP request against their nick
				const msg = new Msg({
					type: Msg.Type.CTCP_REQUEST,
					time: data.time,
					from: new User({nick: data.nick}),
					hostmask: data.ident + "@" + data.hostname,
					ctcpMessage: data.message,
				});
				lobby.pushMessage(client, msg, true);
			},
			1000,
			{trailing: false}
		)
	);
};
