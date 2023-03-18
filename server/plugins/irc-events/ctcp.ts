import _ from "lodash";
import {IrcEventHandler} from "../../client";
import Helper from "../../helper";
import Msg, {MessageType} from "../../models/msg";
import User from "../../models/user";
import pkg from "../../../package.json";

const ctcpResponses = {
	CLIENTINFO: () =>
		Object.getOwnPropertyNames(ctcpResponses)
			.filter((key) => key !== "CLIENTINFO" && typeof ctcpResponses[key] === "function")
			.join(" "),
	PING: ({message}: {message: string}) => message.substring(5),
	SOURCE: () => pkg.repository.url,
	VERSION: () => pkg.name + " " + Helper.getVersion() + " -- " + pkg.homepage,
};

export default <IrcEventHandler>function (irc, network) {
	const client = this;
	const lobby = network.getLobby();

	irc.on("ctcp response", function (data) {
		const shouldIgnore = network.ignoreList.some(function (entry) {
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
		chan.pushMessage(client, msg, true);
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

				const shouldIgnore = network.ignoreList.some(function (entry) {
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
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
