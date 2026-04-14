import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

const typeMap: Record<string, MessageType> = {
	FAIL: MessageType.ERROR,
	WARN: MessageType.WARN,
	NOTE: MessageType.NOTE,
};

export default <IrcEventHandler>function (irc, network) {
	const client = this;

	irc.on("standard reply", function (data) {
		const type = typeMap[data.type] || MessageType.ERROR;

		let target = network.getLobby();

		// If the reply references a channel that exists, show it there
		if (data.context.length > 0) {
			for (const param of data.context) {
				const channel = network.getChannel(param);

				if (typeof channel !== "undefined") {
					target = channel;
					break;
				}
			}
		}

		target.pushMessage(
			client,
			new Msg({
				type,
				text: data.description,
				showInActive: true,
			}),
			true
		);
	});
};
