import _ from "lodash";
import {IrcEventHandler} from "../../client.js";
import Helper from "../../helper.js";
import Msg from "../../models/msg.js";
import User from "../../models/user.js";
import pkg from "../../../package.json";
import {MessageType} from "../../../shared/types/msg.js";

const ctcpResponses = {
	CLIENTINFO: () =>
		Object.getOwnPropertyNames(ctcpResponses)
			.filter((key) => key !== "CLIENTINFO" && typeof ctcpResponses[key] === "function")
			.join(" "),
	PING: ({message}: {message: string}) => message.substring(5),
	SOURCE: () => pkg.repository.url,
	VERSION: () => pkg.name + " -- " + pkg.homepage,
};

export default <IrcEventHandler>function (irc, network) {
	const lobby = network.getLobby();

	irc.on("ctcp response", (data) => {
		const shouldIgnore = network.ignoreList.some((entry) => {
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
			type: MessageType.CTCP,
			time: data.time,
			from: chan.getUser(data.nick),
			ctcpMessage: data.message,
		});
		chan.pushMessage(this, msg, true);
	});

	// Limit requests to a rate of one per second max
	irc.on(
		"ctcp request",
		_.throttle(
			(data) => {
				// Ignore echoed ctcp requests that aren't targeted at us
				// See https://github.com/kiwiirc/irc-framework/issues/225
				if (
					data.nick === irc.user.nick &&
					data.nick !== data.target &&
					network.irc.network.cap.isEnabled("echo-message")
				) {
					return;
				}

				const shouldIgnore = network.ignoreList.some((entry) => {
					return Helper.compareHostmask(entry, data);
				});

				if (shouldIgnore) {
					return;
				}

				const target = data.from_server ? data.hostname : data.nick;
				const response = ctcpResponses[data.type];

				if (response) {
					irc.ctcpResponse(target, data.type, response(data));
				}

				// Let user know someone is making a CTCP request against their nick
				const msg = new Msg({
					type: MessageType.CTCP_REQUEST,
					time: data.time,
					from: new User({nick: target}),
					hostmask: data.ident + "@" + data.hostname,
					ctcpMessage: data.message,
				});
				lobby.pushMessage(this, msg, true);
			},
			1000,
			{trailing: false}
		)
	);
};
