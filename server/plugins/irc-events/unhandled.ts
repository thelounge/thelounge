import {IrcEventHandler} from "../../client";

import Msg, {MessageType} from "../../models/msg";

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("unknown command", function (command) {
		let target = network.getLobby();

		// Do not display users own name
		if (command.params.length > 0 && command.params[0] === network.irc.user.nick) {
			command.params.shift();
		}

		// Check the length again because we may shift the nick above
		if (command.params.length > 0) {
			// If this numeric starts with a channel name that exists
			// put this message in that channel
			const channel = network.getChannel(command.params[0]);

			if (typeof channel !== "undefined") {
				target = channel;
			}
		}

		target.pushMessage(
			client,
			new Msg({
				type: MessageType.UNHANDLED,
				command: command.command,
				params: command.params,
			}),
			true
		);
	});
};
