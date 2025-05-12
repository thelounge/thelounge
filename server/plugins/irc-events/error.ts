import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import Config from "../../config";
import {MessageType} from "../../../shared/types/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	let keepNickRetryTimer: NodeJS.Timeout | null = null;

	irc.on("irc error", function (data) {
		const msg = new Msg({
			type: MessageType.ERROR,
			error: data.error,
			showInActive: true,
			nick: data.nick,
			channel: data.channel,
			reason: data.reason,
			command: data.command,
		});

		let target = network.getLobby();

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

	irc.on("nick in use", function (data) {
		let message = data.nick + ": " + (data.reason || "Nickname is already in use.");

		const keepNickOnConnect =
			typeof network.keepNickOnConnect === "boolean" ? network.keepNickOnConnect : false;

		if (irc.connection.registered === false && !Config.values.public) {
			message += keepNickOnConnect
				? " will keep retrying until this nick is available."
				: " an attempt to use it will be made when this nick quits.";

			// Clients usually get 'nick in use' on connect when reconnecting to a network
			// after a network failure (like ping timeout), and as a result of that,
			// The Lounge will append a random number to the nick.
			// keepNick will try to set the original nick name back if it sees a QUIT for that nick.
			// This logic is important for users who want to always keep their preferred nick.
			network.keepNick = irc.user.nick;
		}

		const lobby = network.getLobby();
		const msg = new Msg({
			type: MessageType.ERROR,
			text: message,
			showInActive: true,
		});
		lobby.pushMessage(client, msg, true);

		if (irc.connection.registered === false) {
			const nickLen = parseInt(network.irc.network.options.NICKLEN, 10) || 16;

			if (keepNickOnConnect) {
				// Wait and retry original nick ever x seconds
				if (!keepNickRetryTimer && network.keepNick) {
					keepNickRetryTimer = setInterval(() => {
						if (network.keepNick) {
							irc.changeNick(network.keepNick);
						}
					}, 10000); // TODO: maybe make this configurable?
				}

				// Do not change to a fallback nick, just keep retrying
				return;
			}

			// Only use fallback if keepNickOnConnect is false
			const random: string = (data.nick || irc.user.nick) + Math.floor(Math.random() * 10);

			// Safeguard nick changes up to allowed length
			// Some servers may send "nick in use" error even for randomly generated nicks
			if (random.length <= nickLen) {
				irc.changeNick(random);
				// Only emit UI update if fallback is used
				client.emit("nick", {
					network: network.uuid,
					nick: random,
				});

				return;
			}

			return;
		}

		client.emit("nick", {
			network: network.uuid,
			nick: irc.user.nick,
		});
	});

	// Listen for successful nick change to clear retry timer
	irc.on("nick", function (data) {
		if (network.keepNick && data.new_nick === network.keepNick) {
			if (keepNickRetryTimer) {
				clearInterval(keepNickRetryTimer);
				keepNickRetryTimer = null;
			}

			network.keepNick = null;
		}
	});

	irc.on("nick invalid", function (data) {
		const lobby = network.getLobby();
		const msg = new Msg({
			type: MessageType.ERROR,
			text: data.nick + ": " + (data.reason || "Nickname is invalid."),
			showInActive: true,
		});
		lobby.pushMessage(client, msg, true);

		if (irc.connection.registered === false) {
			irc.changeNick(Config.getDefaultNick());
		}

		client.emit("nick", {
			network: network.uuid,
			nick: irc.user.nick,
		});
	});
};
