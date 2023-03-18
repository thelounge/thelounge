import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";
import Config from "../../config";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

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

		if (irc.connection.registered === false && !Config.values.public) {
			message += " An attempt to use it will be made when this nick quits.";

			// Clients usually get nick in use on connect when reconnecting to a network
			// after a network failure (like ping timeout), and as a result of that,
			// TL will append a random number to the nick.
			// keepNick will try to set the original nick name back if it sees a QUIT for that nick.
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

			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			const random = (data.nick || irc.user.nick) + Math.floor(Math.random() * 10);

			// Safeguard nick changes up to allowed length
			// Some servers may send "nick in use" error even for randomly generated nicks
			if (random.length <= nickLen) {
				irc.changeNick(random);
			}
		}

		client.emit("nick", {
			network: network.uuid,
			nick: irc.user.nick,
		});
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
