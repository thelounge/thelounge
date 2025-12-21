import {IrcEventHandler} from "../../client.js";

import Msg from "../../models/msg.js";
import {MessageType} from "../../../shared/types/msg.js";

// Commands handled by other plugins - don't display as unhandled
const handledCommands = new Set(["SPGROUPS", "SPJOIN"]);

export default <IrcEventHandler>function (irc, network) {
	irc.on("unknown command", (command) => {
		// Skip commands that are handled by other plugins
		if (handledCommands.has(command.command)) {
			return;
		}

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
			this,
			new Msg({
				type: MessageType.UNHANDLED,
				command: command.command,
				params: command.params,
			}),
			true
		);
	});
};
