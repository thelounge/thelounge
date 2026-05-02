import {IrcEventHandler} from "../../client";

import Msg from "../../models/msg";
import {MessageType} from "../../../shared/types/msg";

const typeMap: Record<string, MessageType> = {
	FAIL: MessageType.ERROR,
	WARN: MessageType.WARN,
	NOTE: MessageType.NOTE,
};

const MULTILINE_ERROR_DESCRIPTIONS: Record<string, string> = {
	MULTILINE_MAX_BYTES: "Multiline message too long",
	MULTILINE_MAX_LINES: "Too many lines in multiline message",
	MULTILINE_INVALID_TARGET: "Mismatched target in multiline message",
	MULTILINE_INVALID: "Invalid multiline message",
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

		let text = data.description;

		// Surface a friendlier prefix for multiline batch errors.
		if (
			data.type === "FAIL" &&
			data.command === "BATCH" &&
			data.code &&
			data.code.startsWith("MULTILINE_")
		) {
			const friendly = MULTILINE_ERROR_DESCRIPTIONS[data.code] ?? "Multiline message rejected";
			text = `${friendly}: ${data.description || friendly}`;
		}

		target.pushMessage(
			client,
			new Msg({
				type,
				text,
				showInActive: true,
			}),
			true
		);
	});
};
